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

/** Vertical position of `el` relative to the top of the scrollable content of `scroller`. */
function offsetTopWithin(scroller: HTMLElement, el: HTMLElement): number {
  const sRect = scroller.getBoundingClientRect();
  const eRect = el.getBoundingClientRect();
  return eRect.top - sRect.top + scroller.scrollTop;
}

export type ScrollToTopOptions = {
  topPaddingPx?: number;
  behavior?: 'smooth' | 'auto';
};

/**
 * Anchor `targetEl` to (near) the TOP of the scroll viewport. This is the focused-turn behavior:
 * the latest user message lands at the top, older content scrolls above the viewport,
 * and the assistant reply renders directly underneath.
 *
 * Relies on the scroll container having enough trailing space (bottom spacer) so the target
 * can actually reach the top — otherwise scrollTop is clamped and the user message stays mid-screen.
 */
export function scrollElementToViewportTop(
  scroller: HTMLElement,
  targetEl: HTMLElement,
  opts?: ScrollToTopOptions
): void {
  const topPad = opts?.topPaddingPx ?? 8;
  const behavior = opts?.behavior ?? 'auto';
  const top = offsetTopWithin(scroller, targetEl);
  const maxScroll = Math.max(0, scroller.scrollHeight - scroller.clientHeight);
  const scrollTop = Math.max(0, Math.min(maxScroll, top - topPad));

  if (behavior === 'smooth') {
    scroller.scrollTo({ top: scrollTop, behavior: 'smooth' });
  } else {
    scroller.scrollTop = scrollTop;
  }
}
