'use client';

import type { ChatStatus, UIMessage } from 'ai';
import * as React from 'react';
import { SpeechBubble } from '@/components/speech-bubble';
import { ThinkingIndicator } from '@/components/thinking-indicator';
import { groupMessagesIntoTurns } from '@/app/conversationScroll';
import styles from './ConversationPanel.module.css';

export type ConversationPanelProps = {
  messages: UIMessage[];
  status: ChatStatus;
  streaming: boolean;
  appendThinking: boolean;
  getMessageText: (message: UIMessage) => string;
};

/**
 * Focused-turn anchor scroll.
 *
 * Layout strategy: the LAST `.turn` has min-height equal to the scroll viewport
 * (see ConversationPanel.module.css `.turn:last-child`). When a new user
 * message is appended, the new turn naturally pushes total content height by
 * roughly one viewport, so a single native `scrollIntoView({ block: 'start' })`
 * call lands the new user bubble at the top of the viewport with no JS math,
 * no spacer state, and no observer loops.
 */
export function ConversationPanel({
  messages,
  status,
  streaming,
  appendThinking,
  getMessageText,
}: ConversationPanelProps) {
  const viewportRef = React.useRef<HTMLDivElement | null>(null);
  const latestTurnRef = React.useRef<HTMLElement | null>(null);

  const turns = React.useMemo(() => groupMessagesIntoTurns(messages), [messages]);
  const lastUserId = turns[turns.length - 1]?.user.id ?? null;
  const prevLastUserIdRef = React.useRef<string | null>(null);

  React.useLayoutEffect(() => {
    if (!lastUserId) return;
    if (prevLastUserIdRef.current === lastUserId) return;
    prevLastUserIdRef.current = lastUserId;

    const turnEl = latestTurnRef.current;
    if (!turnEl) return;

    const raf = requestAnimationFrame(() => {
      // Native scroll-into-view, scoped to the panel's own scroller because the
      // viewport is the nearest scrollable ancestor. `block: 'start'` aligns
      // the latest turn's top with the viewport's top edge; `scroll-margin-top`
      // on `.turn` adds the 16px header gap.
      turnEl.scrollIntoView({ block: 'start', behavior: 'smooth' });
    });
    return () => cancelAnimationFrame(raf);
  }, [lastUserId]);

  return (
    <div
      ref={viewportRef}
      className={styles.viewport}
      role="log"
      aria-live="polite"
      aria-relevant="additions text"
    >
      {turns.map((turn, index) => {
        const isLatest = index === turns.length - 1;
        const userText = getMessageText(turn.user);
        const assistant = turn.assistant;
        const assistantText = assistant ? getMessageText(assistant) : '';

        return (
          <section
            key={turn.user.id}
            ref={isLatest ? latestTurnRef : undefined}
            className={styles.turn}
          >
            <div
              className={`${styles.messageRow} ${styles.messageRowUser} ${styles.padUser} ${isLatest ? styles.messageAppear : ''}`}
            >
              <SpeechBubble variant="user">{userText || '\u00a0'}</SpeechBubble>
            </div>

            {assistant ? (
              !assistantText && streaming ? (
                <div
                  className={`${styles.messageRow} ${styles.messageRowAssistant} ${styles.padAssistant}`}
                >
                  <ThinkingIndicator />
                </div>
              ) : (
                <div
                  className={`${styles.messageRow} ${styles.messageRowAssistant} ${styles.padAssistant}`}
                >
                  <SpeechBubble variant="chatbot">{assistantText || '\u00a0'}</SpeechBubble>
                </div>
              )
            ) : null}

            {isLatest && appendThinking ? (
              <div
                className={`${styles.messageRow} ${styles.messageRowAssistant} ${styles.padAssistant}`}
              >
                <ThinkingIndicator />
              </div>
            ) : null}
          </section>
        );
      })}
    </div>
  );
}
