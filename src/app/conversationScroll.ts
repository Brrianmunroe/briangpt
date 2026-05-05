import type { UIMessage } from 'ai';

/** One user message plus the assistant reply that follows it in the thread, if any. */
export type ChatTurn = {
  user: UIMessage;
  assistant: UIMessage | null;
};

/** Group flat `messages` into alternating user-led turns (user then optional assistant). */
export function groupMessagesIntoTurns(messages: UIMessage[]): ChatTurn[] {
  const turns: ChatTurn[] = [];
  for (const m of messages) {
    if (m.role === 'user') {
      turns.push({ user: m, assistant: null });
    } else if (m.role === 'assistant') {
      const last = turns[turns.length - 1];
      if (last && last.assistant === null) {
        last.assistant = m;
      }
    }
  }
  return turns;
}
