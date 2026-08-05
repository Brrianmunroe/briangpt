'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { flushSync } from 'react-dom';
import { Button, ButtonLink } from '@/components/button';
import { Close, DownChevron, Menu, NewChat } from '@/components/icons';
import { Sidebar, type SidebarDensity } from '@/components/sidebar';
import sidebarStyles from '@/components/sidebar/Sidebar.module.css';
import { SocialLinksToolbar } from '@/components/social-links-toolbar';
import { SharedViewTransition } from '@/components/shared-view-transition/SharedViewTransition';
import { CASE_STUDY_LIST } from '@/lib/case-studies';
import { usePrefersReducedMotion } from '@/lib/use-prefers-reduced-motion';
import { CASE_STUDY_NAVIGATION_SETTLED_EVENT } from './work/case-study-navigation';
import styles from './landing.module.css';

const MOBILE_SHELL_MQ = '(max-width: 768px)';
const DESIGNER_ACTIONS = ['researches.', 'collaborates.', 'simplifies.', 'builds.', 'ships.'] as const;
const TYPE_MS = 56;
const DELETE_MS = 34;
const HOLD_AFTER_FULL_MS = 1250;
const PAUSE_BETWEEN_ACTIONS_MS = 320;

const CASE_STUDY_POSTER_META = {
  selexai: {
    eyebrow: '01 AI-powered video editor',
    image: '/work/selexAI/homepage-poster.png',
  },
  curio: {
    eyebrow: '02 · Conversational AI',
    image: '/work/curio/homepage-poster.png',
  },
} as const;

function useIsMobileShell(): boolean {
  const subscribe = React.useCallback((onStoreChange: () => void) => {
    const mq = window.matchMedia(MOBILE_SHELL_MQ);
    mq.addEventListener('change', onStoreChange);
    return () => mq.removeEventListener('change', onStoreChange);
  }, []);

  return React.useSyncExternalStore(
    subscribe,
    () => window.matchMedia(MOBILE_SHELL_MQ).matches,
    () => false
  );
}

function useDesignerActionTypewriter(): string {
  const [action, setAction] = React.useState('');
  const prefersReducedMotion = usePrefersReducedMotion();

  React.useEffect(() => {
    if (prefersReducedMotion) {
      setAction(DESIGNER_ACTIONS[0]);
      return;
    }

    let cancelled = false;
    let actionIndex = 0;
    let timeoutId: ReturnType<typeof setTimeout>;

    const runAction = () => {
      if (cancelled) return;
      const phrase = DESIGNER_ACTIONS[actionIndex % DESIGNER_ACTIONS.length];

      const typeNextCharacter = (length: number) => {
        if (cancelled) return;
        if (length <= phrase.length) {
          setAction(phrase.slice(0, length));
          timeoutId = setTimeout(() => typeNextCharacter(length + 1), TYPE_MS);
          return;
        }

        timeoutId = setTimeout(() => deleteNextCharacter(phrase.length - 1), HOLD_AFTER_FULL_MS);
      };

      const deleteNextCharacter = (length: number) => {
        if (cancelled) return;
        if (length >= 0) {
          setAction(phrase.slice(0, length));
          timeoutId = setTimeout(() => deleteNextCharacter(length - 1), DELETE_MS);
          return;
        }

        actionIndex = (actionIndex + 1) % DESIGNER_ACTIONS.length;
        timeoutId = setTimeout(runAction, PAUSE_BETWEEN_ACTIONS_MS);
      };

      typeNextCharacter(1);
    };

    runAction();

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [prefersReducedMotion]);

  return action;
}

const LINKS = {
  linkedin: 'https://www.linkedin.com/in/brian-munroe-75a486a5/',
  github: 'https://github.com/Brrianmunroe',
  mail: 'mailto:brian_munroe@icloud.com',
  resume: '/resume/Brian_Munroe_Resume_Product_Design.pdf',
} as const;

export type LandingPageProps = {
  initialSidebarDensity?: SidebarDensity;
};

export function LandingPage({ initialSidebarDensity = 'compact' }: LandingPageProps) {
  const router = useRouter();
  const isMobileShell = useIsMobileShell();
  const portraitFrameRef = React.useRef<HTMLDivElement>(null);
  const caseStudyButtonRef = React.useRef<HTMLButtonElement>(null);
  const caseStudyDrawerRef = React.useRef<HTMLElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [sidebarDensity, setSidebarDensity] =
    React.useState<SidebarDensity>(initialSidebarDensity);
  const [caseStudyTransitioning, setCaseStudyTransitioning] = React.useState(false);
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);
  const [caseStudyDrawerOpen, setCaseStudyDrawerOpen] = React.useState(false);
  const designerAction = useDesignerActionTypewriter();
  const sidebarDensityEffective: SidebarDensity = isMobileShell ? 'comfortable' : sidebarDensity;
  const brianGptHref =
    !isMobileShell && sidebarDensity === 'comfortable' ? '/briangpt?menu=open' : '/briangpt';

  React.useEffect(() => {
    router.prefetch(brianGptHref);
  }, [brianGptHref, router]);

  React.useEffect(() => {
    let resetTimer: number | undefined;
    const resetCaseStudyTransition = () => {
      window.clearTimeout(resetTimer);
      resetTimer = window.setTimeout(() => setCaseStudyTransitioning(false), 800);
    };

    window.addEventListener(CASE_STUDY_NAVIGATION_SETTLED_EVENT, resetCaseStudyTransition);
    return () => {
      window.clearTimeout(resetTimer);
      window.removeEventListener(CASE_STUDY_NAVIGATION_SETTLED_EVENT, resetCaseStudyTransition);
    };
  }, []);

  React.useEffect(() => {
    if (!caseStudyDrawerOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (
        caseStudyButtonRef.current?.contains(target) ||
        caseStudyDrawerRef.current?.contains(target)
      ) {
        return;
      }
      setCaseStudyDrawerOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setCaseStudyDrawerOpen(false);
      caseStudyButtonRef.current?.focus();
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [caseStudyDrawerOpen]);

  React.useEffect(() => {
    const portraitFrame = portraitFrameRef.current;
    const canTrack = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!portraitFrame || !canTrack || prefersReducedMotion) {
      portraitFrame?.style.setProperty('--gaze-x', '0px');
      portraitFrame?.style.setProperty('--gaze-y', '0px');
      return;
    }

    let animationFrame = 0;

    const resetGaze = () => {
      portraitFrame.style.setProperty('--gaze-x', '0px');
      portraitFrame.style.setProperty('--gaze-y', '0px');
    };

    const trackPointer = (event: PointerEvent) => {
      if (event.pointerType && event.pointerType !== 'mouse') return;
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(() => {
        const bounds = portraitFrame.getBoundingClientRect();
        const deltaX = event.clientX - (bounds.left + bounds.width / 2);
        const deltaY = event.clientY - (bounds.top + bounds.height / 2);
        const distance = Math.hypot(deltaX, deltaY) || 1;
        const strength = Math.min(distance / Math.max(bounds.width, bounds.height), 1);

        portraitFrame.style.setProperty('--gaze-x', `${(deltaX / distance) * strength * 2.75}px`);
        portraitFrame.style.setProperty('--gaze-y', `${(deltaY / distance) * strength * 2.25}px`);
      });
    };

    window.addEventListener('pointermove', trackPointer, { passive: true });
    window.addEventListener('blur', resetGaze);
    document.documentElement.addEventListener('mouseleave', resetGaze);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('pointermove', trackPointer);
      window.removeEventListener('blur', resetGaze);
      document.documentElement.removeEventListener('mouseleave', resetGaze);
    };
  }, [prefersReducedMotion]);

  const handleMenuClick = React.useCallback(() => {
    if (isMobileShell) setMobileNavOpen((open) => !open);
    else {
      setSidebarDensity((density) => {
        const nextDensity = density === 'compact' ? 'comfortable' : 'compact';
        window.history.replaceState(
          window.history.state,
          '',
          nextDensity === 'comfortable' ? '/?menu=open' : '/'
        );
        return nextDensity;
      });
    }
  }, [isMobileShell]);

  const prepareCaseStudyNavigation = React.useCallback(() => {
    /** Remove the homepage's shared-transition boundaries before Next starts its route
     * transition. The case-study shell owns this animation; retaining both layers creates
     * a top-layer portrait snapshot over the modal. */
    flushSync(() => {
      setCaseStudyTransitioning(true);
      setCaseStudyDrawerOpen(false);
      if (isMobileShell) setMobileNavOpen(false);
    });
  }, [isMobileShell]);

  const openCaseStudy = React.useCallback(
    (slug: string) => {
      prepareCaseStudyNavigation();
      router.push(`/work/${slug}`);
    },
    [prepareCaseStudyNavigation, router]
  );

  return (
    <div className={styles.shell}>
      {isMobileShell && mobileNavOpen ? (
        <button
          type="button"
          className={styles.navScrim}
          aria-label="Close menu"
          onClick={() => setMobileNavOpen(false)}
        />
      ) : null}

      <div
        className={`${styles.sidebarHost}${isMobileShell ? ` ${styles.sidebarHostMobile}` : ''}${
          isMobileShell && mobileNavOpen ? ` ${styles.sidebarHostMobileOpen}` : ''
        }`}
        {...(isMobileShell && !mobileNavOpen ? ({ inert: true } as const) : {})}
      >
        <Sidebar
          density={sidebarDensityEffective}
          className={[styles.sidebarColumnFill, isMobileShell ? styles.mobileDrawerSidebar : '']
            .filter(Boolean)
            .join(' ')}
        >
          <Sidebar.Stack>
            <Sidebar.HeaderRow
              title="Home"
              brandHref="/"
              showBrandMark={false}
              onMenuClick={handleMenuClick}
              menuIcon={
                isMobileShell && mobileNavOpen ? <Close color="grey" size={16} aria-hidden /> : undefined
              }
              menuButtonProps={{
                'aria-label': isMobileShell
                  ? mobileNavOpen
                    ? 'Close menu'
                    : 'Open menu'
                  : sidebarDensity === 'comfortable'
                    ? 'Collapse sidebar to icon rail'
                    : 'Expand sidebar',
                'aria-expanded': isMobileShell ? mobileNavOpen : sidebarDensity === 'comfortable',
              }}
            />
            <Sidebar.NewChatButton onClick={() => router.push(brianGptHref)}>
              New Chat
            </Sidebar.NewChatButton>
            <Sidebar.NavSection sectionLabel="Projects">
              {CASE_STUDY_LIST.map((caseStudy) => (
                <Sidebar.NavItem
                  key={caseStudy.slug}
                  onClick={() => openCaseStudy(caseStudy.slug)}
                >
                  {caseStudy.title}
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
              interactive={false}
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

      <main className={styles.page} data-home-destination>
        <header className={styles.header}>
          <div className={styles.headerLeading}>
            {isMobileShell ? (
              <button
                type="button"
                className={`${sidebarStyles.menuButton} ${styles.mobileMenuButton}`}
                aria-label={mobileNavOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileNavOpen}
                onClick={() => setMobileNavOpen((open) => !open)}
              >
                {mobileNavOpen ? (
                  <Close color="grey" size={16} aria-hidden />
                ) : (
                  <Menu color="grey" size={16} aria-hidden />
                )}
              </button>
            ) : null}
          </div>
          <SocialLinksToolbar
            variant="links"
            linkedinHref={LINKS.linkedin}
            githubHref={LINKS.github}
            mailHref={LINKS.mail}
            resumeHref={LINKS.resume}
          />
        </header>

        <section className={styles.hero} aria-labelledby="landing-title">
          <div className={styles.copy}>
            <SharedViewTransition disabled={caseStudyTransitioning} name="homepage-title">
              <h1 id="landing-title" className={styles.heroTitle}>
                Brian
                <br />
                Munroe<span className={styles.accent}>.</span>
              </h1>
            </SharedViewTransition>
            <p
              className={styles.role}
              aria-label="Product Designer who researches, collaborates, simplifies, builds, and ships"
            >
              <span aria-hidden="true">
                Product Designer who <span className={styles.typedAction}>{designerAction}</span>
                <span className={styles.typingCaret}>|</span>
              </span>
            </p>
            <div className={styles.actions}>
              <Button
                ref={caseStudyButtonRef}
                className={styles.primaryAction}
                showIcon={false}
                aria-expanded={caseStudyDrawerOpen}
                aria-controls="homepage-case-study-posters"
                onClick={() => setCaseStudyDrawerOpen((open) => !open)}
              >
                View case studies
              </Button>
              <ButtonLink
                className={styles.secondaryAction}
                href={brianGptHref}
                prefetch
                variant="secondary"
                icon={
                  <NewChat
                    fill="var(--button-icon-fill)"
                    size={20}
                    weight="semibold"
                    strokeWidth={0.825}
                    aria-hidden
                  />
                }
                iconPosition="end"
              >
                Try BrianGPT
              </ButtonLink>
            </div>
          </div>

          <div className={styles.portraitStage}>
            <SharedViewTransition disabled={caseStudyTransitioning} name="hero-avatar">
              <div ref={portraitFrameRef} className={styles.portraitFrame}>
                <Image
                  className={styles.portrait}
                  src="/headshot-eye-base.png"
                  alt="Memoji portrait of Brian Munroe"
                  width={1254}
                  height={1254}
                  priority
                  decoding="sync"
                  sizes="(max-width: 760px) 78vw, 42vw"
                />
                <span className={styles.detachedIrisLeft} aria-hidden="true">
                  <Image
                    className={styles.detachedIrisArtwork}
                    src="/left-iris.png"
                    alt=""
                    width={345}
                    height={345}
                    sizes="32px"
                    priority
                    decoding="sync"
                  />
                </span>
                <span className={`${styles.eyeLayer} ${styles.eyeLayerRight}`} aria-hidden="true">
                  <Image
                    className={styles.eyeArtwork}
                    src="/headshot-upscaled.png"
                    alt=""
                    width={1254}
                    height={1254}
                    sizes="(max-width: 760px) 78vw, 42vw"
                    priority
                    decoding="sync"
                  />
                </span>
                <Image
                  className={styles.portraitForeground}
                  src="/headshot-upscaled.png"
                  alt=""
                  width={1254}
                  height={1254}
                  sizes="(max-width: 760px) 78vw, 42vw"
                />
                <Image
                  className={styles.leftEyelidForeground}
                  src="/headshot-upscaled.png"
                  alt=""
                  width={1254}
                  height={1254}
                  sizes="(max-width: 760px) 78vw, 42vw"
                />
              </div>
            </SharedViewTransition>
          </div>
        </section>

        <div className={styles.workDrawerDock}>
          <section
            ref={caseStudyDrawerRef}
            className={`${styles.workDrawer}${
              caseStudyDrawerOpen ? ` ${styles.workDrawerOpen}` : ''
            }`}
            aria-label="Selected case studies"
          >
            <button
              type="button"
              className={styles.workDrawerTrigger}
              aria-expanded={caseStudyDrawerOpen}
              aria-controls="homepage-case-study-posters"
              onClick={() => setCaseStudyDrawerOpen((open) => !open)}
            >
              <span>View selected work</span>
              <span className={styles.workDrawerHint}>Two case studies</span>
              <DownChevron
                className={styles.workDrawerChevron}
                color="grey"
                size={16}
                aria-hidden
              />
            </button>

            <div id="homepage-case-study-posters" className={styles.posterGrid}>
              {CASE_STUDY_LIST.map((caseStudy) => {
                const meta = CASE_STUDY_POSTER_META[caseStudy.slug];
                return (
                  <Link
                    key={caseStudy.slug}
                    className={`${styles.posterCard} ${styles[`posterCard_${caseStudy.slug}`]}`}
                    href={`/work/${caseStudy.slug}`}
                    aria-label={`Open case study: ${caseStudy.title}`}
                    onClick={(event) => {
                      if (
                        event.button !== 0 ||
                        event.metaKey ||
                        event.ctrlKey ||
                        event.shiftKey ||
                        event.altKey
                      ) {
                        return;
                      }
                      prepareCaseStudyNavigation();
                    }}
                  >
                    <span className={styles.posterEyebrow}>{meta.eyebrow}</span>
                    <span className={styles.posterCopy}>
                      <strong className={styles.posterTitle}>{caseStudy.title}</strong>
                      <span className={styles.posterDetail}>{caseStudy.subtitle}</span>
                    </span>
                    <span className={styles.posterArtwork} aria-hidden="true">
                      <Image
                        className={styles.posterArtworkImage}
                        src={meta.image}
                        alt=""
                        fill
                        sizes="(max-width: 480px) 70vw, 36vw"
                      />
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
