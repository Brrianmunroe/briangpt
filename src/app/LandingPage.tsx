'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { Close, Menu } from '@/components/icons';
import { Sidebar, type SidebarDensity } from '@/components/sidebar';
import sidebarStyles from '@/components/sidebar/Sidebar.module.css';
import { SocialLinksToolbar } from '@/components/social-links-toolbar';
import { CASE_STUDY_LIST } from '@/lib/case-studies';
import styles from './landing.module.css';

const MOBILE_SHELL_MQ = '(max-width: 768px)';
const DESIGNER_ACTIONS = ['researches.', 'collaborates.', 'simplifies.', 'builds.', 'ships.'] as const;
const TYPE_MS = 56;
const DELETE_MS = 34;
const HOLD_AFTER_FULL_MS = 1250;
const PAUSE_BETWEEN_ACTIONS_MS = 320;

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

  React.useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
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
  }, []);

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
  const [sidebarDensity, setSidebarDensity] =
    React.useState<SidebarDensity>(initialSidebarDensity);
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);
  const designerAction = useDesignerActionTypewriter();
  const sidebarDensityEffective: SidebarDensity = isMobileShell ? 'comfortable' : sidebarDensity;
  const brianGptHref =
    !isMobileShell && sidebarDensity === 'comfortable' ? '/briangpt?menu=open' : '/briangpt';

  React.useEffect(() => {
    const portraitFrame = portraitFrameRef.current;
    const canTrack = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!portraitFrame || !canTrack || reduceMotion) return;

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
  }, []);

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
            <Sidebar.NewChatButton onClick={() => window.location.assign(brianGptHref)}>
              New Chat
            </Sidebar.NewChatButton>
            <Sidebar.NavSection sectionLabel="Projects">
              {CASE_STUDY_LIST.map((caseStudy) => (
                <Sidebar.NavItem
                  key={caseStudy.slug}
                  onClick={() => {
                    router.push(`/work/${caseStudy.slug}`);
                    if (isMobileShell) setMobileNavOpen(false);
                  }}
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
            <h1 id="landing-title" className={styles.heroTitle}>
              Brian
              <br />
              Munroe<span className={styles.accent}>.</span>
            </h1>
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
              <a className={styles.primaryAction} href={brianGptHref}>
                Explore BrianGPT
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>

          <div className={styles.portraitStage}>
            <div ref={portraitFrameRef} className={styles.portraitFrame}>
              <Image
                className={styles.portrait}
                src="/headshot-eye-base.png"
                alt="Memoji portrait of Brian Munroe"
                width={1254}
                height={1254}
                priority
                sizes="(max-width: 760px) 78vw, 42vw"
              />
              <span className={styles.detachedIrisLeft} aria-hidden="true">
                <img className={styles.detachedIrisArtwork} src="/left-iris.png" alt="" />
              </span>
              <span className={`${styles.eyeLayer} ${styles.eyeLayerRight}`} aria-hidden="true">
                <img className={styles.eyeArtwork} src="/headshot-upscaled.png" alt="" />
              </span>
              <img
                className={styles.portraitForeground}
                src="/headshot-upscaled.png"
                alt=""
                aria-hidden="true"
              />
              <img
                className={styles.leftEyelidForeground}
                src="/headshot-upscaled.png"
                alt=""
                aria-hidden="true"
              />
            </div>
          </div>
        </section>

        <footer className={styles.footer}>
          <span>Designing from curiosity to shipped product.</span>
          <span>Boston · Halifax</span>
        </footer>
      </main>
    </div>
  );
}
