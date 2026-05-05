'use client';

import type { ChatStatus, UIMessage } from 'ai';
import * as React from 'react';
import { SpeechBubble } from '@/components/speech-bubble';
import { ThinkingIndicator } from '@/components/thinking-indicator';
import { groupMessagesIntoTurns, scrollElementToViewportTop } from '@/app/conversationScroll';
import styles from './ConversationPanel.module.css';

/** Distance from the ideal "anchored at top" scrollTop before we treat user as having taken over scrolling. */
const MANUAL_SCROLL_BREAK_PX = 80;
/** Distance back to ideal scrollTop where we resume auto-follow. */
const AUTO_FOLLOW_RESUME_PX = 24;
/** Padding from viewport top when anchoring the latest user message. */
/** Matches --spacing-md (16px) so the anchored gap matches viewport padding-top. */
const TOP_ANCHOR_PADDING_PX = 16;

export type ConversationPanelProps = {
  messages: UIMessage[];
  status: ChatStatus;
  streaming: boolean;
  appendThinking: boolean;
  getMessageText: (message: UIMessage) => string;
};

export function ConversationPanel({
  messages,
  status,
  streaming,
  appendThinking,
  getMessageText,
}: ConversationPanelProps) {
  const viewportRef = React.useRef<HTMLDivElement | null>(null);
  const latestUserRef = React.useRef<HTMLDivElement | null>(null);
  const [bottomSpacerPx, setBottomSpacerPx] = React.useState(0);

  // Whether auto-follow is active. Becomes false when user scrolls away from anchor;
  // restored when they scroll back near the anchor or when a new turn starts.
  const followRef = React.useRef(true);

  // The scrollTop value that represents "latest user message anchored at top".
  const idealScrollTopRef = React.useRef(0);

  // Set true while we are programmatically scrolling so the scroll listener does
  // not misinterpret it as the user breaking follow.
  const programmaticScrollRef = React.useRef(false);

  const turns = React.useMemo(() => groupMessagesIntoTurns(messages), [messages]);
  const lastUserId = turns[turns.length - 1]?.user.id ?? null;
  const prevLastUserIdRef = React.useRef<string | null>(null);

  const updateBottomSpacer = React.useCallback(() => {
    const frame = viewportRef.current;
    if (!frame) return;
    // Ensure there is always enough trailing scroll room for the latest user
    // message to reach the top anchor line.
    const px = Math.max(0, Math.ceil(frame.clientHeight - TOP_ANCHOR_PADDING_PX));
    setBottomSpacerPx(px);
  }, []);

  React.useLayoutEffect(() => {
    updateBottomSpacer();
  }, [lastUserId, updateBottomSpacer]);

  // Anchor the latest user message to the top of the viewport whenever a new
  // turn starts. This is the single source of truth for focused-turn behavior.
  React.useLayoutEffect(() => {
    if (!lastUserId) return;
    const isNewTurn = prevLastUserIdRef.current !== lastUserId;
    prevLastUserIdRef.current = lastUserId;
    if (!isNewTurn) return;

    const frame = viewportRef.current;
    const userEl = latestUserRef.current;
    if (!frame || !userEl) return;

    followRef.current = true;
    programmaticScrollRef.current = true;

    // Snap instantly so the user bubble is guaranteed at the anchor position
    // even if smooth scroll is interrupted. Then re-snap on the next two
    // frames to absorb post-mount layout shifts (assistant placeholder,
    // bottom spacer recalculation, ResizeObserver-driven height changes).
    scrollElementToViewportTop(frame, userEl, {
      topPaddingPx: TOP_ANCHOR_PADDING_PX,
      behavior: 'auto',
    });

    let raf1 = 0;
    let raf2 = 0;
    raf1 = requestAnimationFrame(() => {
      const f = viewportRef.current;
      const u = latestUserRef.current;
      if (f && u) {
        scrollElementToViewportTop(f, u, {
          topPaddingPx: TOP_ANCHOR_PADDING_PX,
          behavior: 'auto',
        });
        idealScrollTopRef.current = f.scrollTop;
      }
      raf2 = requestAnimationFrame(() => {
        const f2 = viewportRef.current;
        const u2 = latestUserRef.current;
        if (f2 && u2) {
          scrollElementToViewportTop(f2, u2, {
            topPaddingPx: TOP_ANCHOR_PADDING_PX,
            behavior: 'auto',
          });
          idealScrollTopRef.current = f2.scrollTop;
        }
        programmaticScrollRef.current = false;
      });
    });

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [lastUserId]);

  // Re-anchor (without animation) whenever the latest user element resizes —
  // happens because the bottom spacer recalculates as content height changes.
  // Keeps the user message visually pinned without fighting the user.
  React.useEffect(() => {
    const frame = viewportRef.current;
    const userEl = latestUserRef.current;
    if (!frame || !userEl) return;

    const ro = new ResizeObserver(() => {
      updateBottomSpacer();
      if (!followRef.current) return;
      programmaticScrollRef.current = true;
      scrollElementToViewportTop(frame, userEl, {
        topPaddingPx: TOP_ANCHOR_PADDING_PX,
        behavior: 'auto',
      });
      idealScrollTopRef.current = frame.scrollTop;
      // Release on next frame so the scroll event from this jump is ignored.
      requestAnimationFrame(() => {
        programmaticScrollRef.current = false;
      });
    });

    ro.observe(userEl);
    // Also observe the viewport itself so window resize re-anchors.
    ro.observe(frame);
    return () => ro.disconnect();
  }, [lastUserId, updateBottomSpacer]);

  // Manual scroll detection: pause follow when user scrolls away, resume when
  // they return near the anchor.
  React.useEffect(() => {
    const frame = viewportRef.current;
    if (!frame) return;

    const onScroll = () => {
      if (programmaticScrollRef.current) return;
      const delta = Math.abs(frame.scrollTop - idealScrollTopRef.current);
      if (followRef.current) {
        if (delta > MANUAL_SCROLL_BREAK_PX) followRef.current = false;
      } else if (delta < AUTO_FOLLOW_RESUME_PX) {
        followRef.current = true;
      }
    };

    frame.addEventListener('scroll', onScroll, { passive: true });
    return () => frame.removeEventListener('scroll', onScroll);
  }, []);

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
          <section key={turn.user.id} className={styles.turn}>
            <div
              ref={isLatest ? latestUserRef : undefined}
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

      {/*
        Trailing spacer that reserves room below the latest turn so the user message
        can always scroll up to the top of the viewport, even when the assistant
        reply is shorter than the viewport. This is the key to ChatGPT-style
        focused turn behavior — without it, scrollTop gets clamped early.
      */}
      <div className={styles.bottomSpacer} style={{ height: `${bottomSpacerPx}px` }} aria-hidden />
    </div>
  );
}
