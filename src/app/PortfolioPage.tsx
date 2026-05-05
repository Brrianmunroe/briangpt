'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, type ChatStatus, type UIMessage } from 'ai';
import * as React from 'react';
import { Card } from '@/components/card';
import { ChatInput } from '@/components/chat-input';
import { NameTag } from '@/components/name-tag';
import { PromptChip } from '@/components/prompt-chip';
import type { SidebarDensity } from '@/components/sidebar';
import { Sidebar } from '@/components/sidebar';
import { SocialLinksToolbar } from '@/components/social-links-toolbar';
import { SpeechBubble } from '@/components/speech-bubble';
import { ThinkingIndicator } from '@/components/thinking-indicator';
import styles from './portfolio.module.css';

/** Leading chip icon — Figma asset on `Prompt Chip` (node 334:466). */
const PROMPT_CHIP_SPARKLE_SRC =
  'https://www.figma.com/api/mcp/asset/3639ed2e-825e-4610-9a36-8c45f8ac7bd2';

const LINKS = {
  linkedin: 'https://www.linkedin.com/in/brian-munroe-75a486a5/',
  github: 'https://github.com/Brrianmunroe',
  mail: 'mailto:brian_munroe@icloud.com',
  website: 'https://www.figma.com/design/mlYfMT6fTkpOn91clhFTxs/BrianGPT',
} as const;

const STARTER_PROMPTS = [
  'Your best work',
  'Your design process',
  'Your case studies',
  'Your design philosophy',
  'How you use AI in design',
] as const;

const CASE_CARDS = [
  {
    variant: 'primary' as const,
    title: 'AI Chat Interface',
    subtitle: 'Modern chatbot UI with NLP',
  },
  {
    variant: 'secondary' as const,
    title: 'Enterprise Design System',
    subtitle: 'Scalable component library for fintech products',
  },
  {
    variant: 'secondary' as const,
    title: 'Mobile Banking App',
    subtitle: 'Award-winning mobile experience',
  },
];

function getTextFromMessage(message: UIMessage): string {
  return message.parts
    .filter((part): part is { type: 'text'; text: string } => part.type === 'text')
    .map((part) => part.text)
    .join('');
}

/** After Stop, drop the in-flight assistant tail and the matching user turn so the draft is the only copy. */
function rollbackLastSendTurn(messages: UIMessage[], sentText: string): UIMessage[] {
  const next = [...messages];
  const trimmedSent = sentText.trim();
  while (next.length > 0) {
    const last = next[next.length - 1]!;
    if (last.role === 'assistant') {
      next.pop();
      continue;
    }
    if (last.role === 'user') {
      const t = getTextFromMessage(last).trim();
      if (t === trimmedSent) {
        next.pop();
      }
      break;
    }
    break;
  }
  return next;
}

const CHIP_SCROLL_SLOP_PX = 2;

/** Distance from bottom within which we keep “stuck” to latest messages. */
const STICKY_SCROLL_THRESHOLD_PX = 80;

const MSG_ENTER_DURATION_MS = 300;
const MSG_ENTER_EASING = 'cubic-bezier(0.16, 1, 0.3, 1)';

function chipRowShowsRightFade(el: HTMLDivElement): boolean {
  const { scrollLeft, clientWidth, scrollWidth } = el;
  if (scrollWidth <= clientWidth + CHIP_SCROLL_SLOP_PX) return false;
  return scrollLeft + clientWidth < scrollWidth - CHIP_SCROLL_SLOP_PX;
}

function chipRowShowsLeftFade(el: HTMLDivElement): boolean {
  const { scrollLeft, clientWidth, scrollWidth } = el;
  if (scrollWidth <= clientWidth + CHIP_SCROLL_SLOP_PX) return false;
  return scrollLeft > CHIP_SCROLL_SLOP_PX;
}

/** Last user message id in list — most recent user turn. */
function getLastUserMessage(messages: UIMessage[]): UIMessage | null {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === 'user') return messages[i];
  }
  return null;
}

function shouldAppendThinkingRow(messages: UIMessage[], status: ChatStatus): boolean {
  if (status === 'submitted') return true;
  if (status !== 'streaming') return false;
  const last = messages[messages.length - 1];
  return Boolean(last && last.role === 'user');
}

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return reduced;
}

export function PortfolioPage() {
  const [draft, setDraft] = React.useState('');
  const [sidebarDensity, setSidebarDensity] = React.useState<SidebarDensity>('comfortable');
  const chipRowRef = React.useRef<HTMLDivElement>(null);
  const [chipScrollFadeRightVisible, setChipScrollFadeRightVisible] = React.useState(false);
  const [chipScrollFadeLeftVisible, setChipScrollFadeLeftVisible] = React.useState(false);
  const lastSentTextRef = React.useRef<string | null>(null);

  const threadScrollRef = React.useRef<HTMLDivElement | null>(null);
  const threadContentRef = React.useRef<HTMLDivElement | null>(null);
  const composerHostRef = React.useRef<HTMLDivElement | null>(null);
  const messageRowElsRef = React.useRef<Map<string, HTMLDivElement>>(new Map());
  /** When true, keep scroll pinned to the bottom as messages append or grow. */
  const autoFollowRef = React.useRef(true);
  /** Ignore `scroll` events triggered by `scrollTop` changes so we don’t flip auto-follow off. */
  const isProgrammaticScrollRef = React.useRef(false);
  const flipOriginRectRef = React.useRef<DOMRect | null>(null);
  const awaitingUserFlipRef = React.useRef(false);

  const prefersReducedMotion = usePrefersReducedMotion();

  const { messages, sendMessage, stop, status, setMessages, error, clearError } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  });

  const streaming = status === 'streaming';
  const requestInFlight = status === 'submitted' || status === 'streaming';
  const conversationMode = messages.length > 0;

  const appendThinking = shouldAppendThinkingRow(messages, status);

  const updateChipScrollFade = React.useCallback(() => {
    const el = chipRowRef.current;
    if (!el) return;
    setChipScrollFadeRightVisible(chipRowShowsRightFade(el));
    setChipScrollFadeLeftVisible(chipRowShowsLeftFade(el));
  }, []);

  const onThreadScroll = React.useCallback(() => {
    const el = threadScrollRef.current;
    if (!el || isProgrammaticScrollRef.current) return;
    const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    autoFollowRef.current = distFromBottom <= STICKY_SCROLL_THRESHOLD_PX;
  }, []);

  React.useLayoutEffect(() => {
    const el = chipRowRef.current;
    if (!el) return;
    updateChipScrollFade();
    const ro = new ResizeObserver(() => updateChipScrollFade());
    ro.observe(el);
    window.addEventListener('resize', updateChipScrollFade);
    let cancelled = false;
    void document.fonts.ready.then(() => {
      if (!cancelled) updateChipScrollFade();
    });
    return () => {
      cancelled = true;
      ro.disconnect();
      window.removeEventListener('resize', updateChipScrollFade);
    };
  }, [updateChipScrollFade]);

  /** Thread fills scrollport height (`--thread-viewport-h`) + snap to bottom while auto-follow is on. */
  React.useLayoutEffect(() => {
    const frame = threadScrollRef.current;
    if (!conversationMode || !frame) return;

    const syncViewportVar = () => {
      frame.style.setProperty('--thread-viewport-h', `${frame.clientHeight}px`);
    };

    const runSnap = () => {
      if (!autoFollowRef.current) return;
      isProgrammaticScrollRef.current = true;
      frame.scrollTop = frame.scrollHeight;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          isProgrammaticScrollRef.current = false;
        });
      });
    };

    const syncLayout = () => {
      syncViewportVar();
      runSnap();
      requestAnimationFrame(() => {
        syncViewportVar();
        runSnap();
      });
    };

    syncLayout();

    const roFrame = new ResizeObserver(syncLayout);
    roFrame.observe(frame);
    return () => {
      roFrame.disconnect();
      frame.style.removeProperty('--thread-viewport-h');
    };
  }, [conversationMode, messages, status, appendThinking, streaming]);

  /** Re-snap when thread grows (streaming reflow) while auto-follow is on. */
  React.useEffect(() => {
    const scrollEl = threadScrollRef.current;
    const contentEl = threadContentRef.current;
    if (!conversationMode || !scrollEl || !contentEl) return;

    const snapIfFollowing = () => {
      if (!autoFollowRef.current) return;
      isProgrammaticScrollRef.current = true;
      scrollEl.scrollTop = scrollEl.scrollHeight;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          isProgrammaticScrollRef.current = false;
        });
      });
    };

    const ro = new ResizeObserver(snapIfFollowing);
    ro.observe(contentEl);
    ro.observe(scrollEl);
    return () => ro.disconnect();
  }, [conversationMode]);

  /** FLIP user bubble from composer to thread (same frame as scroll snap). */
  React.useLayoutEffect(() => {
    if (!conversationMode || !awaitingUserFlipRef.current) return;

    if (prefersReducedMotion) {
      awaitingUserFlipRef.current = false;
      flipOriginRectRef.current = null;
      return;
    }

    const origin = flipOriginRectRef.current;
    const lastUser = getLastUserMessage(messages);
    if (!origin || !lastUser?.id) {
      awaitingUserFlipRef.current = false;
      flipOriginRectRef.current = null;
      return;
    }

    const rowEl = messageRowElsRef.current.get(lastUser.id);
    if (!rowEl) {
      awaitingUserFlipRef.current = false;
      flipOriginRectRef.current = null;
      return;
    }

    const dest = rowEl.getBoundingClientRect();
    const dx =
      origin.left + origin.width / 2 - (dest.left + dest.width / 2);
    const dy =
      origin.top + origin.height / 2 - (dest.top + dest.height / 2);

    rowEl.style.willChange = 'transform, opacity';
    rowEl.style.transition = 'none';
    rowEl.style.transform = `translate(${dx}px, ${dy}px)`;
    rowEl.style.opacity = '0';

    awaitingUserFlipRef.current = false;
    flipOriginRectRef.current = null;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        rowEl.style.transition = `transform ${MSG_ENTER_DURATION_MS}ms ${MSG_ENTER_EASING}, opacity ${MSG_ENTER_DURATION_MS}ms ${MSG_ENTER_EASING}`;
        rowEl.style.transform = '';
        rowEl.style.opacity = '';
        window.setTimeout(() => {
          rowEl.style.transition = '';
          rowEl.style.willChange = '';
        }, MSG_ENTER_DURATION_MS + 50);
      });
    });
  }, [conversationMode, messages, prefersReducedMotion]);

  const setMessageRowRef = React.useCallback(
    (id: string, node: HTMLDivElement | null) => {
      if (node) messageRowElsRef.current.set(id, node);
      else messageRowElsRef.current.delete(id);
    },
    []
  );

  const handleSend = React.useCallback(
    async (trimmed: string) => {
      if (!trimmed || requestInFlight) return;
      const host = composerHostRef.current;
      if (host) {
        flipOriginRectRef.current = host.getBoundingClientRect();
        awaitingUserFlipRef.current = true;
      }
      autoFollowRef.current = true;
      clearError();
      lastSentTextRef.current = trimmed;
      setDraft('');
      try {
        await sendMessage({ text: trimmed });
      } catch {
        const snap = lastSentTextRef.current;
        if (snap != null) {
          setDraft(snap);
          lastSentTextRef.current = null;
        }
        return;
      }
      lastSentTextRef.current = null;
    },
    [clearError, requestInFlight, sendMessage]
  );

  const handleStop = React.useCallback(() => {
    const restore = lastSentTextRef.current;
    void stop();
    if (restore == null || restore === '') return;
    lastSentTextRef.current = null;
    setDraft(restore);
    setMessages((prev) => rollbackLastSendTurn(prev, restore));
  }, [setMessages, stop]);

  const handleNewChat = React.useCallback(() => {
    clearError();
    setMessages([]);
    setDraft('');
    autoFollowRef.current = true;
    flipOriginRectRef.current = null;
    awaitingUserFlipRef.current = false;
    messageRowElsRef.current.clear();
  }, [clearError, setMessages]);

  const toggleSidebarDensity = React.useCallback(() => {
    setSidebarDensity((d) => (d === 'comfortable' ? 'compact' : 'comfortable'));
  }, []);

  const sparkleIcon = (
    <img
      src={PROMPT_CHIP_SPARKLE_SRC}
      width={16}
      height={16}
      alt=""
      className={styles.chipSparkle}
    />
  );

  const lastThreadMessage = messages.length > 0 ? messages[messages.length - 1] : undefined;

  return (
    <div className={styles.shell}>
      <div className={styles.sidebarHost}>
        <Sidebar density={sidebarDensity}>
          <Sidebar.Stack>
            <Sidebar.HeaderRow
              title="BrianGPT"
              showBrandMark={false}
              onMenuClick={toggleSidebarDensity}
              menuButtonProps={{
                'aria-label':
                  sidebarDensity === 'comfortable' ? 'Collapse sidebar to icon rail' : 'Expand sidebar',
                'aria-expanded': sidebarDensity === 'comfortable',
              }}
            />
            <Sidebar.NewChatButton onClick={handleNewChat}>New Chat</Sidebar.NewChatButton>
            <Sidebar.NavSection sectionLabel="Projects">
              {CASE_CARDS.map((c) => (
                <Sidebar.NavItem key={c.title}>{c.title}</Sidebar.NavItem>
              ))}
            </Sidebar.NavSection>
          </Sidebar.Stack>
          <Sidebar.FooterSlot>
            <Sidebar.Profile name="Brian Munroe" roleLine="Product Designer" />
          </Sidebar.FooterSlot>
        </Sidebar>
      </div>

      <main className={styles.main}>
        <div
          className={
            conversationMode ? `${styles.mainColumn} ${styles.mainColumnChat}` : styles.mainColumn
          }
        >
          {!conversationMode ? (
            <div className={styles.mainScroll}>
              <header className={styles.mainHeader}>
                <SocialLinksToolbar
                  variant="links"
                  linkedinHref={LINKS.linkedin}
                  githubHref={LINKS.github}
                  mailHref={LINKS.mail}
                />
              </header>

              <div className={styles.chatSection}>
                <div className={styles.landingColumn}>
                  <div className={styles.landingCluster}>
                    <div className={styles.messageHeader}>
                      <NameTag />
                      <h1 className={styles.heroH1}>BrianGPT - Building with AI</h1>
                    </div>
                    <div ref={composerHostRef} className={styles.composerHostLanding}>
                      <ChatInput
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        onSubmit={(t) => void handleSend(t)}
                        streaming={requestInFlight}
                        onStop={handleStop}
                        rotatingPlaceholderPrompts={STARTER_PROMPTS}
                        followUpPlaceholder="Ask a follow up"
                        followUpEmphasis={false}
                        layout="stacked"
                        maxWidth="full"
                        textareaProps={{ autoFocus: true }}
                      />

                      {error ? (
                        <p className={styles.chatError} role="alert">
                          Something went wrong — please try again.
                        </p>
                      ) : null}

                      <div className={styles.chipScrollWrap}>
                        <div
                          ref={chipRowRef}
                          className={styles.chipRow}
                          role="list"
                          aria-label="Suggested prompts"
                          onScroll={updateChipScrollFade}
                        >
                          {STARTER_PROMPTS.map((label) => (
                            <div key={label} className={styles.chipSlot} role="listitem">
                              <PromptChip
                                buttonType="button"
                                icon={sparkleIcon}
                                onClick={() => void handleSend(label)}
                                disabled={requestInFlight}
                              >
                                {label}
                              </PromptChip>
                            </div>
                          ))}
                        </div>
                        {chipScrollFadeLeftVisible ? (
                          <div className={styles.chipScrollFadeLeft} aria-hidden />
                        ) : null}
                        {chipScrollFadeRightVisible ? (
                          <div className={styles.chipScrollFadeRight} aria-hidden />
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.cardsRow}>
                {CASE_CARDS.map((c) => (
                  <div key={c.title} className={styles.cardCell}>
                    <Card
                      className={styles.homeCard}
                      variant={c.variant}
                      title={c.title}
                      subtitle={c.subtitle}
                    />
                  </div>
                ))}
              </div>
              </div>
            </div>
          ) : (
            <>
              <header className={`${styles.mainHeader} ${styles.mainHeaderConversation}`}>
                <SocialLinksToolbar
                  variant="links"
                  linkedinHref={LINKS.linkedin}
                  githubHref={LINKS.github}
                  mailHref={LINKS.mail}
                />
              </header>

              <div className={styles.chatSectionConversation}>
                <div
                  ref={threadScrollRef}
                  className={styles.conversationFrame}
                  role="log"
                  aria-live="polite"
                  aria-relevant="additions text"
                  onScroll={onThreadScroll}
                >
                  <div ref={threadContentRef} className={styles.threadContent}>
                    <div className={styles.threadTopSpacer} aria-hidden />
                    {messages.map((m) => {
                    const text = getTextFromMessage(m);
                    const isLastMessageRow = Boolean(
                      lastThreadMessage && m.id === lastThreadMessage.id
                    );
                    if (m.role === 'assistant' && !text && streaming) {
                      const enterClassStreaming =
                        isLastMessageRow && !prefersReducedMotion ? styles.messageEnter : undefined;
                      return (
                        <div
                          key={m.id}
                          className={[
                            styles.messageRow,
                            styles.messageRowAssistant,
                            styles.messageRowConversationAssistant,
                            enterClassStreaming,
                          ]
                            .filter(Boolean)
                            .join(' ')}
                        >
                          <ThinkingIndicator />
                        </div>
                      );
                    }
                    const variant = m.role === 'user' ? 'user' : 'chatbot';
                    const rowClass =
                      m.role === 'user' ? styles.messageRowUser : styles.messageRowAssistant;
                    const convPad =
                      m.role === 'user'
                        ? styles.messageRowConversationUser
                        : styles.messageRowConversationAssistant;
                    /** CSS enter only for the tail row; users use FLIP unless reduced motion. */
                    const enterClass =
                      m.role === 'user'
                        ? prefersReducedMotion && isLastMessageRow
                          ? styles.messageEnter
                          : undefined
                        : isLastMessageRow && !prefersReducedMotion
                          ? styles.messageEnter
                          : undefined;
                    return (
                      <div
                        key={m.id}
                        ref={(node) => setMessageRowRef(m.id, node)}
                        className={[styles.messageRow, rowClass, convPad, enterClass]
                          .filter(Boolean)
                          .join(' ')}
                      >
                        <SpeechBubble variant={variant} wide={variant === 'chatbot'}>
                          {text || '\u00a0'}
                        </SpeechBubble>
                      </div>
                    );
                  })}
                  {appendThinking ? (
                    <div
                      className={`${styles.messageRow} ${styles.messageRowAssistant} ${styles.messageRowConversationAssistant}`}
                    >
                      <ThinkingIndicator />
                    </div>
                  ) : null}
                  </div>
                </div>

                <div ref={composerHostRef} className={styles.composerDock}>
                  <div className={styles.composerGradient}>
                    <ChatInput
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      onSubmit={(t) => void handleSend(t)}
                      streaming={requestInFlight}
                      onStop={handleStop}
                      followUpPlaceholder="Ask a follow up"
                      followUpEmphasis
                      layout="stacked"
                      maxWidth="full"
                    />
                    {error ? (
                      <p className={styles.chatError} role="alert">
                        Something went wrong — please try again.
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
