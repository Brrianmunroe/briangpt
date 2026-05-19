# BrianGPT — Step by Step Build Guide

Work through this document one step at a time with Cursor.
Copy the prompt, paste it into Cursor Agent, wait for it to finish,
check every box in the checklist, then move to the next step.

**Do not move forward until every checkbox is checked.**

---

## How this repo is set up (read this first)

- **TypeScript:** The app uses `.ts` and `.tsx` files — not plain `page.js` / `route.js`.
- **App Router location:** Routes live under **`src/app/`** (for example `src/app/page.tsx`, `src/app/api/chat/route.ts`).
- **AI SDK:** This project targets **Vercel AI SDK 6.x**. On the server use `streamText` from `ai` and `openai` from `@ai-sdk/openai`. On the client use **`useChat` from `@ai-sdk/react`** with **`new DefaultChatTransport({ api: '/api/chat' })`**. Return **`result.toUIMessageStreamResponse({ originalMessages: messages })`** from the API route (UI message stream protocol). Older tutorials may say `useChat` from `ai/react` and `toDataStreamResponse()` — that is not what this codebase uses.
- **Path mapping (if you see old snippets):** “Change `app/page.js` only” → put chat wiring in **`src/app/PortfolioPage.tsx`** (and keep **`src/app/page.tsx`** as a thin wrapper if you prefer). “Create `app/api/chat/route.js`” → create **`src/app/api/chat/route.ts`**.

---

## context.md — how to build the knowledge file (keep this quality bar)

Single portfolio, chat-forward experience: **`context.md` is your content system and most of the “prompt.”** Markdown in-repo is **standard** for this scale. Later you can add tools, retrieval, or a CMS—don’t block on that for v1.

*Product framing below is adapted from guidance by Ryo Lu (design lead, Cursor) — condensed for this repo.*

### 1. Define the interaction fantasy (one clear frame)

Write **one short paragraph**: what is this chat *pretending* to be?

Examples (pick **one** and commit): *an AI version of you grounded in written facts* · *recruiter-facing guide to your work* · *concierge for your portfolio* — **not** a vague “ask me anything” oracle unless your content is huge and tight.

If the frame is blurry, answers feel generic or cringe.

### 2. Pick **exactly three** jobs for v1

Not twenty. Typical trio:

- **Who you are** — role, strengths, what you care about  
- **Proof** — a few flagship projects with real decisions + outcomes  
- **Next step** — contact, what you’re looking for, links to deeper work  

List these explicitly in `context.md` so the model **prioritizes persuasion** over open-ended ramble.

### 3. Layer the file like a prompt (same doc, clean sections)

Mirror a **prompt architecture** so nothing important is buried in one wall of text:

| Layer | Put it in `context.md` as… |
|--------|------------------------------|
| Identity + voice | Bio, tone, phrases you’d actually say |
| Facts | Roles, skills, projects (structured), links |
| Conversation rails | FAQ, “when they ask X, emphasize Y”, starter-prompt alignment |
| Memory behavior | **Tiny for v1:** “only use this file + current chat; do not invent past visits” |
| Response style | Length, bullets vs prose, markdown rules |
| Safety + business | Off-limits topics, **hard fallback** when unknown |

### 4. Structure content **like data** (easy to skim for you and the model)

- **Same template for every project** (name, role, problem, what you did, outcome, links, optional stack).  
- Prefer **scannable lists** over long paragraphs for facts.  
- **FAQ** in **spoken** voice — highest impact for “sounds like me.”  
- **One fact, one place** (don’t maintain three different bios).

### 5. Conversation rails + first 30 seconds

- **Starter prompts** in the UI should match **paths you want** (who / best work / process / contact).  
- Optional: add a **“Rails”** section in `context.md`: bullet list of intents you want to handle well.

### 6. Voice discipline

Goal: **like you, slightly cleaner and more consistent than real life** — not generic LinkedIn, not over-theatrical “personality.”

- Add **2–4 example lines** in your own words.  
- Add **“Never say / never do”** (corporate fluff, hedging you hate).

### 7. Hard fallback (non‑negotiable)

Spell out what to do when something **isn’t** in the file: admit the gap, **do not bluff**, point to **email**, **resume**, or **featured projects** (whatever you use).

### 8. Memory & cost (portfolio v1)

- **Memory:** assume **short chat history only** + this file — no long-term profile unless you build it later.  
- **Don’t over-build memory first**; optional later: “remember last project discussed” (see Future phases).

### 9. What this doc is **not** (yet)

v1 **does not require**: embeddings, vector DB, tool calling, or an “AI OS” shell. Those are **future** upgrades if the product grows (see **Future phases** below).

---

## Step 1 of 8 — Install Packages

### What this does

Installs all the backend and chat-client libraries the project needs.

### Paste into Cursor:

Install the following packages into the existing Next.js project:

```bash
npm install ai @ai-sdk/openai @ai-sdk/react @upstash/ratelimit @upstash/redis
```

Do not change any unrelated files.
Confirm `npm run dev` still runs with zero errors after installing.

### Checklist — complete before Step 2:

- All listed packages installed with no errors
- `npm run dev` still works
- No new errors in the terminal

---

## Step 2 of 8 — Create context.md

### What this does

Creates the file that becomes the AI's brain.
Everything it knows about you lives here.
Fill in the placeholders with your real content before Step 6.

### Paste into Cursor:

Create a file called `context.md` in the **project root** with these sections (order matters for readability — follows **context.md — how to build the knowledge file** above):

# Interaction fantasy

[One short paragraph: what this chat is pretending to be — e.g. grounded “AI you” vs recruiter guide. Pick **one** frame.]

# What this chat must nail (v1)

Pick **exactly three** bullets — the three outcomes you want every visit to achieve (e.g. who you are, proof via projects, how to contact / what you want next).

# Bio

[2-3 sentences — match the fantasy; third person *or* first person, not both]

# Role and Skills

Role: [Your title]
Core skills: [Your main design skills]
Tools: [Figma, etc.]

# Working style (optional but strong)

[How you collaborate, critique, hand off to eng — recruiters ask this.]

# Projects

Use the **same sub-bullets for every project** (structured like data):

## [Project Name]

- My role:
- Problem:
- What I did: [3–6 concrete bullets]
- Key decision:
- Outcome: [metric, launch, scope, or honest qualitative result]
- Links: [case study, product, etc. — if public]

Repeat for **3–5** projects total.

# Conversation rails (optional)

[Bullets: when they ask X, lead with Y — aligns with your UI starter prompts.]

# Voice guidelines

- Tone: [adjectives — warm, direct, etc.]
- Example phrases: [2–4 lines in **your** spoken voice]
- Never say / never do: [corporate fluff, topics, hedging you hate]
- Style note: [like you, slightly cleaner than real life — not cringe, not generic]

# Memory behavior (v1)

[One short block: e.g. “Only use this file + current conversation; do not invent employers, degrees, or clients not named here.”]

# FAQ

Q: [question]
A: [answer in spoken voice — not résumé paste]
Repeat for **5+** questions total.

# Contact & hard fallback

Email: [brian_munroe@icloud.com](mailto:brian_munroe@icloud.com)
LinkedIn: [your LinkedIn URL]
Website: [your portfolio OR GitHub]
**If something isn’t in this file:** [exact behavior — admit gap; point to email / featured projects / resume; never bluff]

# Off limits

- [No medical/legal/financial advice, etc.]

Do not touch any other files.

### Checklist — complete before Step 3:

- `context.md` exists in project root
- **Interaction fantasy** + **three v1 jobs** sections exist (can be placeholder until Step 6)
- **Voice**, **FAQ**, **Contact + hard fallback**, and **Off limits** blocks exist
- Every project slot uses the **same sub-bullet template**
- `npm run dev` still works

---

## Step 3 of 8 — Set Up Upstash Redis

### What this does

Creates a free rate limiter that stops anyone from spamming
your chatbot and running up your OpenAI bill.
Done in your browser — not in Cursor.

### Do this manually:

1. Go to upstash.com and create a free account
2. Click Create Database
3. Name it "briangpt", select US-East-1 (closest to Boston)
4. Click Create
5. On the database page find the REST API section
6. Copy both values shown:
  - `UPSTASH_REDIS_REST_URL`
  - `UPSTASH_REDIS_REST_TOKEN`
7. Open `.env.local` in your project root and add all three lines:

```
OPENAI_API_KEY=your-openai-key-here
UPSTASH_REDIS_REST_URL=your-upstash-url-here
UPSTASH_REDIS_REST_TOKEN=your-upstash-token-here
```

1. Save the file, stop and restart `npm run dev`

### Checklist — complete before Step 4:

- Upstash account created
- Redis database created
- Both Upstash values added to `.env.local`
- `OPENAI_API_KEY` added to `.env.local`
- `npm run dev` restarted with no errors

---

## Step 4 of 8 — Build the Hardened API Route

### What this does

Creates the secure server-side route that connects your chatbot
to OpenAI. Includes rate limiting, input validation, error
handling, and CORS protection in one file.

### Paste into Cursor:

Create `**src/app/api/chat/route.ts**` with these security layers in order:

LAYER 1 — ENV CHECK  
If `OPENAI_API_KEY` is missing, return **500** JSON such as:  
`{ "error": "Missing OPENAI_API_KEY — check your .env.local file" }`  
(do not throw raw strings without a proper Response).

LAYER 2 — RATE LIMITING  
Use `@upstash/ratelimit` and `@upstash/redis`.  
Max **10 requests per IP per minute**, sliding window.  
IP from: `request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'anonymous'`  
If exceeded return **429**:  
`{ "error": "Too many requests. Please wait a moment." }`  
*(On Vercel, `x-forwarded-for` is set by the platform — don’t trust it from random clients on an open server without an edge you control.)*

LAYER 3 — INPUT VALIDATION  
Parse JSON body and read `messages` (UI message array from the client).  
Return **400** if:

- `messages` is missing or not an array
- `messages` is empty
- any single user-visible text exceeds **1000 characters** (define how you measure this for `UIMessage` / parts)
- `messages` has more than **50** items

LAYER 4 — LOAD CONTEXT  
Read `context.md` from the project root asynchronously, for example:

```ts
import { promises as fs } from 'fs';
import path from 'path';

const contextPath = path.join(process.cwd(), 'context.md');
const context = await fs.readFile(contextPath, 'utf8');
```

LAYER 5 — SYSTEM PROMPT  
Build the system string using the context file content. The model should:

- Only answer questions about Brian Munroe and his work
- Sound conversational, warm, and confident
- Never fabricate projects or experience not in the context file
- Keep responses to 2-4 sentences unless more detail is requested
- If it cannot answer: suggest **[brian_munroe@icloud.com](mailto:brian_munroe@icloud.com)** (or your real contact from `context.md`)

LAYER 6 — STREAM RESPONSE  
Use `streamText` from `ai` with `openai('gpt-4o')`, validated model messages, and `maxTokens: 500`.  
Convert UI messages to model messages if needed (`convertToModelMessages` from `ai`).  
Return `**result.toUIMessageStreamResponse({ originalMessages: messages })`** so `useChat` on the client stays in sync.

LAYER 7 — ERROR HANDLING  
Wrap `streamText` / response creation in **try/catch**. On failure return **500**:  
`{ "error": "Something went wrong — please try again." }`  
Never expose raw error objects or stack traces to the client.

LAYER 8 — CORS  
In **production**, reject requests whose `Origin` header does not match your deployed site (allow all origins in development). Use `process.env.NODE_ENV === 'production'` to branch.

Confirm `npm run dev` runs with no errors after creating or updating the file.

### Checklist — complete before Step 5:

- `src/app/api/chat/route.ts` created or updated
- All 8 layers present
- `npm run dev` runs with no errors

---

## Step 5 of 8 — Wire useChat to the Frontend

### What this does

Connects your existing UI components to the AI backend.
Makes the chat actually work.
Prefer **no visual redesign** — chat **logic** only (in `PortfolioPage.tsx` or equivalent).

### Paste into Cursor:

In `**src/app/PortfolioPage.tsx`** (primary place for chat behavior), wire `**useChat**` from `**@ai-sdk/react**`:

```ts
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';

const { messages, sendMessage, status, setMessages, error } = useChat({
  transport: new DefaultChatTransport({ api: '/api/chat' }),
});
```

Wire so that:

- **Chat input:** controlled local state (or SDK-managed input if you switch) updates text; **submit** calls `sendMessage({ text: trimmed })` (or equivalent for your `ChatInput` API).
- **Prompt chips:** each chip calls `sendMessage({ text: chipLabel })`.
- **Message list:** map `messages` to your bubble / row components; derive display text from `message.parts` where `type === 'text'`.
- **Loading / streaming:** use `status === 'streaming'` (and related statuses) to show a typing indicator or disabled controls while the assistant responds.
- **New Chat:** calls `setMessages([])` (and clears any local draft state).

**Error state:**  
If `error` is set (or the transport reports failure), show near the input:  
`Something went wrong — please try again.`

**Screen state (portfolio layout):**  

- Default: show hero, chips, project cards, and input as designed.  
- After first message (optional polish): hide hero / chips / cards and show the thread — match your UX spec.  
- Keep the input accessible (e.g. pinned at bottom on small viewports if that’s the design).

Touch only the page / layout files needed for wiring (typically `**PortfolioPage.tsx`** and optionally `**page.tsx**`). Avoid restyling shared components unless necessary.

### Checklist — complete before Step 6:

- Sending a message gets a real AI response
- Response streams incrementally in the UI
- Loading/streaming state is visible while the model generates
- Clicking a chip sends that message
- New Chat resets the conversation
- Error message shows on failure
- Home → conversation transition matches your spec

---

## Step 6 of 8 — Fill in context.md

### What this does

Replaces placeholders with your real content.
The AI is only as good as what you write here.
This is the most important step in the whole project.

Re-read **context.md — how to build the knowledge file** at the top of this doc before editing.

### Do this yourself — no Cursor needed:

Open `context.md` and replace every placeholder with real content.

**Interaction fantasy** — one honest paragraph; **one** frame only (no mixed metaphors).

**What this chat must nail (v1)** — finalize your **three** priorities; delete vague extras.

**Bio** — 2–4 sentences; consistent person (first or third).

**Role and skills** — exact title, strongest skills, daily tools.

**Working style** — optional but high value for “how do you work?” questions.

**Projects** — 3–5 real pieces; **same template every time**; outcomes must be **true** (numbers or honest qualitative).

**Conversation rails** — align bullets with your **starter prompts** in the UI.

**Voice guidelines** — adjectives + **example phrases in your voice** + **never say** list; aim “like you, slightly cleaner.”

**Memory behavior** — confirm v1 is file + current chat only; no invented credentials.

**FAQ** — 5+ recruiter/founder questions; answers **spoken**, not résumé bullets.

**Contact & hard fallback** — real URLs/email; **explicit** what to do when the bot doesn’t know (no bluffing).

**Off limits** — topics the assistant refuses.

Keep **`context.md` and UI links** in sync (`PortfolioPage` / toolbar).

### Checklist — complete before Step 7:

- Interaction fantasy is **clear** (one frame)
- **Three** v1 jobs are explicit and accurate
- Bio + role/skills finalized
- ≥3 projects, each using the **full** project template
- Voice section has **real example phrases** + anti-patterns
- FAQ has ≥5 Q&As in **spoken** voice
- Contact + **hard fallback** text is exact and true
- Same links in `context.md` and the visible UI

---

## Step 7 of 8 — Test Everything

### What this does

Catches any issues before the site goes live.
Fix every failure before moving to Step 8.

### Paste into Cursor:

Run through this checklist and fix anything that fails.
Report what was tested and what was fixed.

SECURITY:

1. Send an empty message — API should return **400**
2. Send a message over 1000 characters — API should return **400**
3. Open DevTools → Network, send a message — `**OPENAI_API_KEY` must not appear** in any response or request payload
4. Confirm `**.gitignore` includes `.env` and `.env*.local`** (or equivalent) so secrets are not committed — see project root `.gitignore`
5. Confirm no committed file contains real API keys or Upstash tokens
6. Failed API responses show a **clean** user-facing message with **no stack trace** in the browser

FUNCTIONAL:

1. A message returns a **real streaming** assistant reply
2. The assistant **stays on topic** using `context.md`
3. **Streaming / busy** state is obvious in the UI
4. **New Chat** fully resets
5. Each **PromptChip** sends the correct text
6. **Home → conversation** behavior matches your spec

UI:

1. Layout looks correct at **1280px**
2. No browser console errors
3. **Dark mode** (if applicable) looks correct

**Before sharing the URL widely:** rate limiting on, validation on, secrets only in env, smoke-tested on the **production** domain.

**Expectations:** Strong prompts and `context.md` **reduce** wrong answers; they do **not** guarantee a visitor cannot confuse the model (prompt injection). For a public portfolio this is usually acceptable; add moderation or stricter filters only if your threat model needs them.

Fix every failure. Do not move to Step 8 until all checks pass.

### Checklist — complete before Step 8:

- All numbered checks pass
- No API keys visible in browser
- Env files / secrets excluded from git
- No raw errors exposed
- Assistant stays on topic
- No console errors

---

## Step 8 of 8 — Deploy to Vercel

### What this does

Puts your live site on the internet with a real URL.

### Part A — Push to GitHub

Open Cursor terminal (Ctrl + backtick) and run one at a time:

```
git init
git add .
git commit -m "BrianGPT initial build"
```

Then go to github.com:

1. Click New repository
2. Name it "briangpt", set to **Private**
3. Click Create repository
4. Copy the "push an existing repository" commands and run in terminal

### Part B — Deploy on Vercel

1. Go to vercel.com and sign in
2. Click Add New Project
3. Import your briangpt repository
4. Add Environment Variables:
  - `OPENAI_API_KEY`  
  - `UPSTASH_REDIS_REST_URL`  
  - `UPSTASH_REDIS_REST_TOKEN`
5. Click Deploy — takes about 60 seconds

### Part C — Verify live site

1. Open the live URL
2. Send a test message
3. Assistant uses content from `context.md`
4. Response streams in the UI
5. Send **11** messages quickly — **11th** should hit **429** (rate limit)

### Checklist — done when:

- GitHub repo created and code pushed  
- All 3 environment variables in Vercel  
- Build completes with no errors  
- Live URL loads  
- Assistant responds with your real content  
- Streaming works on production  
- Rate limiting works on production  
- No console errors on production

---

## You're Live

BrianGPT is deployed. Share the URL.

### Future phases:

- Mobile responsive polish  
- **Project reveal pane** — chat drives a **visual** payoff (hero, summary, decisions, outcomes, case-study link) — Ryo: chat alone isn’t enough; the reveal should feel special  
- Case study deep-dive pages  
- Sidebar project links auto-populate chat  
- **Optional “one real tool”** — one tool with a **strict JSON schema** (e.g. save snippet, open project id); then structured tool-calling — only when v1 content + UX are solid  
- **Retrieval / embeddings** — if `context.md` outgrows one model context; until then keep **structured sections**  
- **Light memory** — e.g. last project viewed; optional tiny profile; avoid over-building early  
- **Cost controls** — trim history, summarize threads, cache tool results, route cheap tasks to smaller models (as traffic grows)  
- **Local-first persistence** — chats/notes in the browser if the product becomes a “desk” not just a landing page  
- Update content anytime by editing `context.md` and redeploying  

