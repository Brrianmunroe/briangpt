import { openai } from '@ai-sdk/openai';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { convertToModelMessages, streamText, type UIMessage } from 'ai';
import { promises as fs } from 'fs';
import path from 'path';
import {
  CHAT_API_ERROR_MESSAGE,
  CHAT_ERROR_CODE,
  type ChatErrorCode,
  MAX_CHAT_MESSAGES,
} from '@/lib/chat-error-codes';
import { MAX_CHAT_MESSAGE_CHARS } from '@/lib/message-too-long-split';

export const maxDuration = 60;

const CONTEXT_FILENAME = 'context.md';

const SYSTEM_INSTRUCTIONS = `You are the conversational assistant for Brian Munroe’s portfolio site (BrianGPT).

Answer only about Brian Munroe, his work, and what appears in the portfolio knowledge section below. Sound conversational, warm, and confident.

Rules:
- Never invent employers, degrees, clients, certifications, or projects that are not explicitly supported by the portfolio knowledge.
- Keep answers to about 2–4 sentences unless the visitor clearly asks for more depth.
- If you cannot answer from the portfolio knowledge, say so and tell them it’s a great question for Brian directly at brian_munroe@icloud.com.
- Use markdown sparingly (short lists are fine when helpful).`;

function chatErrorResponse(code: ChatErrorCode, status: number, devOnlyMessage?: string) {
  const isProd = process.env.NODE_ENV === 'production';
  const devOnly =
    code === CHAT_ERROR_CODE.SERVICE_UNAVAILABLE &&
    devOnlyMessage != null &&
    (/OPENAI_API_KEY|context\.md|Rate limiting is not configured/i.test(devOnlyMessage) ||
      devOnlyMessage.includes('.env'));

  const error =
    isProd && devOnly
      ? CHAT_API_ERROR_MESSAGE.SERVICE_UNAVAILABLE
      : code === CHAT_ERROR_CODE.RATE_LIMIT
        ? CHAT_API_ERROR_MESSAGE.RATE_LIMIT
        : code === CHAT_ERROR_CODE.MESSAGE_TOO_LONG
          ? CHAT_API_ERROR_MESSAGE.MESSAGE_TOO_LONG
          : code === CHAT_ERROR_CODE.THREAD_TOO_LONG
            ? CHAT_API_ERROR_MESSAGE.THREAD_TOO_LONG
            : devOnlyMessage && !isProd
              ? devOnlyMessage
              : CHAT_API_ERROR_MESSAGE.SERVICE_UNAVAILABLE;

  const resolvedCode =
    isProd && devOnly ? CHAT_ERROR_CODE.SERVICE_UNAVAILABLE : code;

  return new Response(JSON.stringify({ error, code: resolvedCode }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function clientIp(req: Request): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'anonymous';
}

/** Production: allow same host as the request, or no Origin (non-browser clients). */
function originAllowed(req: Request): boolean {
  if (process.env.NODE_ENV !== 'production') return true;
  const origin = req.headers.get('origin');
  if (!origin) return true;
  const host = req.headers.get('host');
  if (!host) return false;
  const proto = req.headers.get('x-forwarded-proto') ?? 'https';
  const expected = `${proto}://${host}`;
  if (origin === expected) return true;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (siteUrl) {
    try {
      if (origin === new URL(siteUrl).origin) return true;
    } catch {
      // ignore invalid NEXT_PUBLIC_SITE_URL
    }
  }
  return false;
}

function getLimiter(): Ratelimit | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(10, '60 s'),
    prefix: 'briangpt:ratelimit',
  });
}

function textLengthFromMessage(message: UIMessage): number {
  return message.parts
    .filter((part): part is { type: 'text'; text: string } => part.type === 'text')
    .reduce((sum, part) => sum + part.text.length, 0);
}

function validateMessages(messages: UIMessage[]):
  | { ok: true }
  | { ok: false; response: Response } {
  if (messages.length === 0) {
    return {
      ok: false,
      response: chatErrorResponse(CHAT_ERROR_CODE.SERVICE_UNAVAILABLE, 400),
    };
  }
  if (messages.length > MAX_CHAT_MESSAGES) {
    return {
      ok: false,
      response: chatErrorResponse(CHAT_ERROR_CODE.THREAD_TOO_LONG, 400),
    };
  }
  for (const message of messages) {
    const len = textLengthFromMessage(message);
    if (len > MAX_CHAT_MESSAGE_CHARS) {
      return {
        ok: false,
        response: chatErrorResponse(CHAT_ERROR_CODE.MESSAGE_TOO_LONG, 400),
      };
    }
  }
  return { ok: true };
}

async function loadContextMarkdown(): Promise<string> {
  const filePath = path.join(process.cwd(), CONTEXT_FILENAME);
  return fs.readFile(filePath, 'utf8');
}

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return chatErrorResponse(
      CHAT_ERROR_CODE.SERVICE_UNAVAILABLE,
      500,
      'Missing OPENAI_API_KEY — check your .env.local file'
    );
  }

  if (!originAllowed(req)) {
    return chatErrorResponse(CHAT_ERROR_CODE.FORBIDDEN, 403);
  }

  const limiter = getLimiter();
  if (process.env.NODE_ENV === 'production' && !limiter) {
    return chatErrorResponse(
      CHAT_ERROR_CODE.SERVICE_UNAVAILABLE,
      503,
      'Rate limiting is not configured'
    );
  }

  if (limiter) {
    const { success } = await limiter.limit(clientIp(req));
    if (!success) {
      return chatErrorResponse(CHAT_ERROR_CODE.RATE_LIMIT, 429);
    }
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return chatErrorResponse(CHAT_ERROR_CODE.SERVICE_UNAVAILABLE, 400);
  }

  const messages = (body as { messages?: UIMessage[] }).messages;
  if (!Array.isArray(messages)) {
    return chatErrorResponse(CHAT_ERROR_CODE.SERVICE_UNAVAILABLE, 400);
  }

  const validation = validateMessages(messages);
  if (!validation.ok) return validation.response;

  let context: string;
  try {
    context = await loadContextMarkdown();
  } catch {
    return chatErrorResponse(
      CHAT_ERROR_CODE.SERVICE_UNAVAILABLE,
      500,
      `Missing or unreadable ${CONTEXT_FILENAME} at project root`
    );
  }

  const system = `${SYSTEM_INSTRUCTIONS}

---

## Portfolio knowledge (from ${CONTEXT_FILENAME})

${context}`;

  try {
    const modelMessages = await convertToModelMessages(
      messages.map(({ id: _id, ...rest }) => rest),
      { ignoreIncompleteToolCalls: true }
    );

    const result = streamText({
      model: openai('gpt-4o'),
      system,
      messages: modelMessages,
      maxOutputTokens: 500,
    });

    return result.toUIMessageStreamResponse({
      originalMessages: messages,
    });
  } catch {
    return chatErrorResponse(CHAT_ERROR_CODE.SERVICE_UNAVAILABLE, 500);
  }
}
