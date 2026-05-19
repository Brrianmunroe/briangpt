import * as React from 'react';
import {
  CHAT_API_ERROR_MESSAGE,
  CHAT_ERROR_CODE,
  type ChatErrorCode,
  MAX_CHAT_MESSAGES,
} from '@/lib/chat-error-codes';
import { messageTooLongSplit, MAX_CHAT_MESSAGE_CHARS } from '@/lib/message-too-long-split';
import bannerStyles from '@/components/chat-error-banner/ChatErrorBanner.module.css';

export type ChatDisplayError = {
  code: ChatErrorCode;
  body: React.ReactNode;
  key: string;
};

function plainBody(text: string): React.ReactNode {
  return text;
}

export function buildMessageTooLongBody(draft: string): React.ReactNode {
  const split = messageTooLongSplit(draft);
  if (!split?.endSnippet) {
    return plainBody('That message is too long. Shorten it or split it into two messages.');
  }

  const { endSnippet, startOverflowSnippet } = split;

  return (
    <>
      Your message is over the {MAX_CHAT_MESSAGE_CHARS.toLocaleString()} character limit. End your
      first message after{' '}
      <span className={bannerStyles.cutoffSnippet}>&ldquo;{endSnippet}&rdquo;</span>
      {startOverflowSnippet ? (
        <>
          {' '}
          and send <span className={bannerStyles.cutoffSnippet}>&ldquo;{startOverflowSnippet}&rdquo;</span>{' '}
          as a follow-up.
        </>
      ) : (
        <> and send the rest as a follow-up.</>
      )}
    </>
  );
}

const COPY: Record<ChatErrorCode, string> = {
  [CHAT_ERROR_CODE.OFFLINE]:
    "You're offline right now. Check your connection, then try again.",
  [CHAT_ERROR_CODE.RATE_LIMIT]:
    "You're sending messages quickly. Please wait about a minute, then try again.",
  [CHAT_ERROR_CODE.MESSAGE_TOO_LONG]:
    'That message is too long. Shorten it or split it into two messages.',
  [CHAT_ERROR_CODE.THREAD_TOO_LONG]:
    'This chat has gotten quite long. Start a new chat to keep going.',
  [CHAT_ERROR_CODE.INTERRUPTED]:
    "The reply didn't finish. Try sending again — your message is still here.",
  [CHAT_ERROR_CODE.SERVICE_UNAVAILABLE]:
    "BrianGPT isn't responding right now. Please try again in a minute.",
  [CHAT_ERROR_CODE.FORBIDDEN]:
    'Something blocked that request. Refresh the page and try again.',
};

function codeFromApiMessage(message: string): ChatErrorCode | null {
  const normalized = message.trim();
  if (normalized.includes(CHAT_API_ERROR_MESSAGE.RATE_LIMIT)) {
    return CHAT_ERROR_CODE.RATE_LIMIT;
  }
  if (
    normalized.includes(CHAT_API_ERROR_MESSAGE.MESSAGE_TOO_LONG) ||
    normalized.includes('maximum length')
  ) {
    return CHAT_ERROR_CODE.MESSAGE_TOO_LONG;
  }
  if (
    normalized.includes(CHAT_API_ERROR_MESSAGE.THREAD_TOO_LONG) ||
    normalized.includes('Too many messages')
  ) {
    return CHAT_ERROR_CODE.THREAD_TOO_LONG;
  }
  return null;
}

function parseApiErrorPayload(message: string): { code?: string; error?: string } | null {
  const trimmed = message.trim();
  if (!trimmed.startsWith('{')) return null;
  try {
    const parsed = JSON.parse(trimmed) as { code?: string; error?: string };
    if (parsed && typeof parsed === 'object') return parsed;
  } catch {
    // not JSON
  }
  return null;
}

function resolveCodeFromApiError(apiError: Error): ChatErrorCode {
  const payload = parseApiErrorPayload(apiError.message);
  if (payload?.code && payload.code in COPY) {
    return payload.code as ChatErrorCode;
  }
  const text = payload?.error ?? apiError.message;
  const fromMessage = codeFromApiMessage(text);
  if (fromMessage) return fromMessage;

  if (/OPENAI_API_KEY|context\.md|Rate limiting is not configured/i.test(text)) {
    return CHAT_ERROR_CODE.SERVICE_UNAVAILABLE;
  }

  return CHAT_ERROR_CODE.SERVICE_UNAVAILABLE;
}

export type ResolveChatErrorInput = {
  online: boolean;
  apiError: Error | null;
  draft?: string;
};

export function resolveChatErrorDisplay(input: ResolveChatErrorInput): ChatDisplayError | null {
  if (!input.online) {
    return {
      code: CHAT_ERROR_CODE.OFFLINE,
      body: plainBody(COPY[CHAT_ERROR_CODE.OFFLINE]),
      key: CHAT_ERROR_CODE.OFFLINE,
    };
  }

  if (!input.apiError) return null;

  const code = resolveCodeFromApiError(input.apiError);
  const draft = input.draft?.trim() ?? '';

  if (code === CHAT_ERROR_CODE.MESSAGE_TOO_LONG && draft.length > MAX_CHAT_MESSAGE_CHARS) {
    return {
      code,
      body: buildMessageTooLongBody(draft),
      key: `${code}-${draft.length}`,
    };
  }

  return {
    code,
    body: plainBody(COPY[code]),
    key: `${code}-${input.apiError.message}`,
  };
}

export function preflightChatError(
  trimmed: string,
  messageCount: number,
  online: boolean
): ChatDisplayError | null {
  if (!online) {
    return {
      code: CHAT_ERROR_CODE.OFFLINE,
      body: plainBody(COPY[CHAT_ERROR_CODE.OFFLINE]),
      key: CHAT_ERROR_CODE.OFFLINE,
    };
  }

  if (trimmed.length > MAX_CHAT_MESSAGE_CHARS) {
    return {
      code: CHAT_ERROR_CODE.MESSAGE_TOO_LONG,
      body: buildMessageTooLongBody(trimmed),
      key: `${CHAT_ERROR_CODE.MESSAGE_TOO_LONG}-${trimmed.length}`,
    };
  }

  if (messageCount >= MAX_CHAT_MESSAGES) {
    return {
      code: CHAT_ERROR_CODE.THREAD_TOO_LONG,
      body: plainBody(COPY[CHAT_ERROR_CODE.THREAD_TOO_LONG]),
      key: CHAT_ERROR_CODE.THREAD_TOO_LONG,
    };
  }

  return null;
}

export { MAX_CHAT_MESSAGE_CHARS, MAX_CHAT_MESSAGES };
