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

const CHIP_SCROLL_SLOP_PX = 2;

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

export function PortfolioPage() {
  const [draft, setDraft] = React.useState('');
  const [sidebarDensity, setSidebarDensity] = React.useState<SidebarDensity>('comfortable');
  const lastUserRowRef = React.useRef<HTMLDivElement | null>(null);
  const prevScrollUserIdRef = React.useRef<string | null>(null);
  const chipRowRef = React.useRef<HTMLDivElement>(null);
  const [chipScrollFadeRightVisible, setChipScrollFadeRightVisible] = React.useState(false);
  const [chipScrollFadeLeftVisible, setChipScrollFadeLeftVisible] = React.useState(false);

  const { messages, sendMessage, stop, status, setMessages, error, clearError } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  });

  const streaming = status === 'streaming';
  const conversationMode = messages.length > 0;
  const lastUserMessage = React.useMemo(() => getLastUserMessage(messages), [messages]);
  const lastUserId = lastUserMessage?.id ?? null;

  React.useLayoutEffect(() => {
    if (!conversationMode || !lastUserId) return;
    if (prevScrollUserIdRef.current === lastUserId) return;
    prevScrollUserIdRef.current = lastUserId;
    lastUserRowRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [conversationMode, lastUserId, messages]);

  const appendThinking = shouldAppendThinkingRow(messages, status);

  const updateChipScrollFade = React.useCallback(() => {
    const el = chipRowRef.current;
    if (!el) return;
    setChipScrollFadeRightVisible(chipRowShowsRightFade(el));
    setChipScrollFadeLeftVisible(chipRowShowsLeftFade(el));
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

  const handleSend = React.useCallback(
    async (trimmed: string) => {
      if (!trimmed || streaming) return;
      clearError();
      setDraft('');
      await sendMessage({ text: trimmed });
    },
    [clearError, sendMessage, streaming]
  );

  const handleStop = React.useCallback(() => {
    void stop();
  }, [stop]);

  const handleNewChat = React.useCallback(() => {
    clearError();
    setMessages([]);
    setDraft('');
    prevScrollUserIdRef.current = null;
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
                <div className={styles.messageBlock}>
                  <div className={styles.messageHeader}>
                    <NameTag />
                    <h1 className={styles.heroH1}>BrianGPT - Building with AI</h1>
                  </div>

                  <div className={styles.actionBlock}>
                    <ChatInput
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      onSubmit={(t) => void handleSend(t)}
                      streaming={streaming}
                      onStop={handleStop}
                      rotatingPlaceholderPrompts={STARTER_PROMPTS}
                      followUpPlaceholder="Ask a follow up"
                      followUpEmphasis={false}
                      layout="stacked"
                      maxWidth="full"
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
                              onClick={() => {
                                clearError();
                                void sendMessage({ text: label });
                              }}
                              disabled={streaming}
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
                  className={styles.conversationFrame}
                  role="log"
                  aria-live="polite"
                  aria-relevant="additions text"
                >
                  {messages.map((m) => {
                    const text = getTextFromMessage(m);
                    if (m.role === 'assistant' && !text && streaming) {
                      return (
                        <div
                          key={m.id}
                          className={`${styles.messageRow} ${styles.messageRowAssistant} ${styles.messageRowConversationAssistant}`}
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
                    const isLastUser = m.role === 'user' && m.id === lastUserId;
                    return (
                      <div
                        key={m.id}
                        ref={isLastUser ? lastUserRowRef : undefined}
                        className={`${styles.messageRow} ${rowClass} ${convPad} ${isLastUser ? styles.messageAppear : ''}`}
                      >
                        <SpeechBubble variant={variant}>{text || '\u00a0'}</SpeechBubble>
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

                <div className={styles.composerGradient}>
                  <ChatInput
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onSubmit={(t) => void handleSend(t)}
                    streaming={streaming}
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
            </>
          )}
        </div>
      </main>
    </div>
  );
}
