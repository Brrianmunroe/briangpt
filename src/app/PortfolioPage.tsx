'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, type ChatStatus, type UIMessage } from 'ai';
import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Card } from '@/components/card';
import { ChatInput } from '@/components/chat-input';
import { NameTag } from '@/components/name-tag';
import { PromptChip } from '@/components/prompt-chip';
import type { SidebarDensity } from '@/components/sidebar';
import { Sidebar } from '@/components/sidebar';
import { SocialLinksToolbar } from '@/components/social-links-toolbar';
import { ConversationPanel } from '@/components/conversation-panel';
import { SidebarAnimationTuner } from '@/components/sidebar-animation-tuner';
import { CASE_STUDY_LIST } from '@/lib/case-studies';
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

const ROTATING_PLACEHOLDER_PROMPTS = [
  'my design process.',
  'my case studies.',
  'my design philosophy.',
  'how I use AI in design.',
  'my favorite project.',
] as const;

const STARTER_CHIP_QUESTIONS = [
  "What's your design process?",
  'What case studies should I look at?',
  "What's your design philosophy?",
  'How do you use AI in design?',
  "What's your favorite project?",
] as const;

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

function shouldAppendThinkingRow(messages: UIMessage[], status: ChatStatus): boolean {
  if (status === 'submitted') return true;
  if (status !== 'streaming') return false;
  const last = messages[messages.length - 1];
  return Boolean(last && last.role === 'user');
}

export function PortfolioPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [draft, setDraft] = React.useState('');
  const [sidebarDensity, setSidebarDensity] = React.useState<SidebarDensity>('comfortable');
  const chipRowRef = React.useRef<HTMLDivElement>(null);
  const composerHostRef = React.useRef<HTMLDivElement | null>(null);
  const [chipScrollFadeRightVisible, setChipScrollFadeRightVisible] = React.useState(false);
  const [chipScrollFadeLeftVisible, setChipScrollFadeLeftVisible] = React.useState(false);
  const lastSentTextRef = React.useRef<string | null>(null);

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
      if (!trimmed || requestInFlight) return;
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
  }, [clearError, setMessages]);

  /** Home link must clear chat when already on `/` — same URL does not remount or reset `useChat`. */
  const handleBrandHomeClick = React.useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (e.button !== 0) return;
      clearError();
      setMessages([]);
      setDraft('');
      if (pathname === '/') {
        e.preventDefault();
      }
    },
    [clearError, pathname, setMessages]
  );

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
              brandHref="/"
              brandLinkProps={{ onClick: handleBrandHomeClick }}
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
              {CASE_STUDY_LIST.map((c) => (
                <Sidebar.NavItem key={c.slug} onClick={() => router.push(`/work/${c.slug}`)}>
                  {c.title}
                </Sidebar.NavItem>
              ))}
            </Sidebar.NavSection>
          </Sidebar.Stack>
          <Sidebar.FooterSlot>
            <Sidebar.Profile
              name="Brian Munroe"
              roleLine="Product Designer"
              showChevron={false}
              disableRowHover
              avatar={
                <img
                  src="/avatars/brian-profile.png"
                  alt=""
                  width={40}
                  height={40}
                  decoding="async"
                />
              }
            />
          </Sidebar.FooterSlot>
        </Sidebar>
      </div>

      <main className={styles.main}>
        <div
          className={
            conversationMode
              ? `${styles.mainColumn} ${styles.mainColumnChat}`
              : `${styles.mainColumn} ${styles.mainColumnHome}`
          }
        >
          {!conversationMode ? (
            <>
              <header className={`${styles.mainHeader} ${styles.mainHeaderConversation}`}>
                <SocialLinksToolbar
                  variant="links"
                  linkedinHref={LINKS.linkedin}
                  githubHref={LINKS.github}
                  mailHref={LINKS.mail}
                />
              </header>

              <div className={styles.mainScroll}>
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
                          rotatingPlaceholderPrompts={ROTATING_PLACEHOLDER_PROMPTS}
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
                            {STARTER_CHIP_QUESTIONS.map((question) => (
                              <div key={question} className={styles.chipSlot} role="listitem">
                                <PromptChip
                                  buttonType="button"
                                  icon={sparkleIcon}
                                  onClick={() => void handleSend(question)}
                                  disabled={requestInFlight}
                                >
                                  {question}
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
                  {CASE_STUDY_LIST.map((c) => (
                    <div key={c.slug} className={styles.cardCell}>
                      <Link
                        href={`/work/${c.slug}`}
                        className={styles.cardLink}
                        aria-label={`Open case study: ${c.title}`}
                      >
                        <Card
                          className={styles.homeCard}
                          variant={c.variant}
                          title={c.title}
                          subtitle={c.subtitle}
                        />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
              </div>
            </>
          ) : (
            <>
              <header
                className={`${styles.mainHeader} ${styles.mainHeaderConversation} ${styles.mainHeaderChatStroke}`}
              >
                <SocialLinksToolbar
                  variant="links"
                  linkedinHref={LINKS.linkedin}
                  githubHref={LINKS.github}
                  mailHref={LINKS.mail}
                />
              </header>

              <div className={styles.chatSectionConversation}>
                <ConversationPanel
                  messages={messages}
                  status={status}
                  streaming={requestInFlight}
                  appendThinking={appendThinking}
                  getMessageText={getTextFromMessage}
                />

                <div className={styles.composerDock}>
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
      {process.env.NODE_ENV === 'development' ? <SidebarAnimationTuner /> : null}
    </div>
  );
}
