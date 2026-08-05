'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/button/Button';
import {
  CASE_STUDY_NAVIGATION_SETTLED_EVENT,
  CASE_STUDY_TITLE_ID,
  syncApplicationInertState,
} from './case-study-navigation';
import { parseWorkShellDurationMs } from './parseWorkShellDurationMs';
import styles from './work-shell.module.css';

const ENTER_MS_FALLBACK = 400;
const EXIT_MS_FALLBACK = 180;

function motionReduced(): boolean {
  if (typeof window === 'undefined') return false;
  if (typeof window.matchMedia !== 'function') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function WorkCaseShell({
  children,
  scaleBackground = false,
  headerExtraGap = false,
  selectAiSurface = false,
  initiallyVisible = false,
  onCloseStart,
  onCloseComplete,
}: {
  children: React.ReactNode;
  scaleBackground?: boolean;
  /** Extra space below the header close (SelectAI). */
  headerExtraGap?: boolean;
  /** Match the narrower, darker SelectAI case-study frame. */
  selectAiSurface?: boolean;
  /** Direct routes render visibly on the server; intercepted modals animate in after mount. */
  initiallyVisible?: boolean;
  /** Lets the direct-route background synchronize with the modal exit without remounting. */
  onCloseStart?: () => void;
  /** Runs when the exit animation has finished and the direct background becomes interactive. */
  onCloseComplete?: () => void;
}) {
  const router = useRouter();
  const sceneRef = React.useRef<HTMLDivElement | null>(null);
  const dialogRef = React.useRef<HTMLDivElement | null>(null);
  const closeButtonRef = React.useRef<HTMLButtonElement | null>(null);
  const restoreFocusRef = React.useRef<HTMLElement | null>(null);
  const [surfaceReady, setSurfaceReady] = React.useState(initiallyVisible);
  const [visible, setVisible] = React.useState(initiallyVisible);
  const [exiting, setExiting] = React.useState(false);
  const [removed, setRemoved] = React.useState(false);
  const [transitioning, setTransitioning] = React.useState(!initiallyVisible);
  const exitTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const settleTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = React.useCallback(() => {
    if (exitTimerRef.current != null) {
      clearTimeout(exitTimerRef.current);
      exitTimerRef.current = null;
    }
    if (settleTimerRef.current != null) {
      clearTimeout(settleTimerRef.current);
      settleTimerRef.current = null;
    }
  }, []);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    if (initiallyVisible) return;
    let cancelled = false;
    let rafEnter1 = 0;
    let rafEnter2 = 0;

    const reduced = motionReduced();
    const enterMs = reduced
      ? Math.max(1, Math.round(ENTER_MS_FALLBACK / 2))
      : parseWorkShellDurationMs(sceneRef.current, '--work-modal-enter-duration', ENTER_MS_FALLBACK);

    setTransitioning(true);

    const scheduleSettle = () => {
      settleTimerRef.current = setTimeout(() => {
        if (!cancelled) setTransitioning(false);
      }, enterMs);
    };

    if (reduced) {
      setSurfaceReady(true);
      setVisible(true);
      scheduleSettle();
    } else {
      rafEnter1 = window.requestAnimationFrame(() => {
        if (cancelled) return;
        setSurfaceReady(true);
        rafEnter2 = window.requestAnimationFrame(() => {
          if (!cancelled) setVisible(true);
        });
      });
      scheduleSettle();
    }

    return () => {
      cancelled = true;
      if (rafEnter1) window.cancelAnimationFrame(rafEnter1);
      if (rafEnter2) window.cancelAnimationFrame(rafEnter2);
      if (settleTimerRef.current != null) {
        clearTimeout(settleTimerRef.current);
        settleTimerRef.current = null;
      }
    };
  }, [initiallyVisible]);

  React.useEffect(() => () => clearTimers(), [clearTimers]);

  React.useEffect(() => {
    syncApplicationInertState();
    return () => syncApplicationInertState();
  }, []);

  React.useEffect(() => {
    if (!scaleBackground) return;
    const activeElement = document.activeElement;
    restoreFocusRef.current = activeElement instanceof HTMLElement ? activeElement : null;
    return () => {
      const target = restoreFocusRef.current;
      restoreFocusRef.current = null;
      if (!target?.isConnected) return;
      window.requestAnimationFrame(() => target.focus({ preventScroll: true }));
    };
  }, [scaleBackground]);

  React.useEffect(() => {
    if (!visible || exiting) return;
    if (document.body.dataset.responsiveConstructionGate === 'open') return;
    const frame = window.requestAnimationFrame(() => {
      closeButtonRef.current?.focus({ preventScroll: true });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [exiting, visible]);

  React.useEffect(() => {
    if (!scaleBackground) return;
    if (typeof document === 'undefined') return;
    const body = document.body;
    if (!surfaceReady) return;
    body.dataset.caseModalState = exiting ? 'closing' : visible ? 'open' : 'opening';
    syncApplicationInertState();
    return () => {
      if (!exiting) delete body.dataset.caseModalState;
      syncApplicationInertState();
    };
  }, [scaleBackground, surfaceReady, visible, exiting]);

  const finishClose = React.useCallback(() => {
    clearTimers();
    if (scaleBackground && typeof document !== 'undefined') {
      delete document.body.dataset.caseModalState;
      syncApplicationInertState();
    }
    onCloseComplete?.();
    window.dispatchEvent(new Event(CASE_STUDY_NAVIGATION_SETTLED_EVENT));

    /** Intercepted modal routes share history with `/`; `back()` clears the slot reliably. */
    if (scaleBackground) {
      router.back();
    } else {
      /** A direct request already rendered the complete homepage behind the modal. Replacing
       * the URL and removing the shell preserves that live page instead of navigating from
       * one homepage instance to another and replaying every shared transition. */
      // Passing null lets Next copy its internal state and update its canonical URL.
      window.history.replaceState(null, '', '/');
      setRemoved(true);
    }
  }, [clearTimers, onCloseComplete, scaleBackground, router]);

  const requestClose = React.useCallback(() => {
    if (exiting) return;
    onCloseStart?.();
    setExiting(true);
    setTransitioning(true);
    const ms = motionReduced()
      ? Math.max(1, Math.round(EXIT_MS_FALLBACK / 2))
      : parseWorkShellDurationMs(sceneRef.current, '--work-modal-exit-duration', EXIT_MS_FALLBACK);
    exitTimerRef.current = setTimeout(finishClose, ms);
  }, [exiting, finishClose, onCloseStart]);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (document.body.dataset.responsiveConstructionGate === 'open') return;
      if (e.key === 'Escape') {
        e.preventDefault();
        requestClose();
        return;
      }
      if (e.key !== 'Tab' || !visible || exiting) return;

      const dialog = dialogRef.current;
      if (!dialog) return;
      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter(
        (element) =>
          !element.hidden &&
          element.getAttribute('aria-hidden') !== 'true' &&
          element.getClientRects().length > 0,
      );
      const first = focusable[0] ?? dialog;
      const last = focusable[focusable.length - 1] ?? dialog;
      const active = document.activeElement;
      const focusOutside = !(active instanceof Node) || !dialog.contains(active);

      if (e.shiftKey && (active === first || focusOutside)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || focusOutside)) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [exiting, requestClose, visible]);

  const scrimClass = [
    styles.scrim,
    surfaceReady && styles.scrimMotionReady,
    visible && !exiting && styles.scrimVisible,
    exiting && styles.scrimExiting,
    transitioning && styles.liveWillChange,
  ]
    .filter(Boolean)
    .join(' ');

  const modalClass = [
    styles.modalLayer,
    surfaceReady && styles.modalMotionReady,
    visible && !exiting && styles.modalVisible,
    exiting && styles.modalExiting,
    transitioning && styles.liveWillChange,
  ]
    .filter(Boolean)
    .join(' ');

  const contentClass = [
    styles.content,
    visible && !exiting && styles.contentVisible,
    exiting && styles.contentExiting,
  ]
    .filter(Boolean)
    .join(' ');

  if (removed) return null;

  return (
    <div
      ref={sceneRef}
      className={`${styles.scene} ${initiallyVisible ? styles.directModalScene : ''}`}
      data-case-study-modal
    >
      <button
        type="button"
        className={scrimClass}
        aria-label="Close case study"
        aria-hidden="true"
        tabIndex={-1}
        onClick={requestClose}
      />
      <div
        ref={dialogRef}
        className={modalClass}
        role="dialog"
        aria-modal="true"
        aria-labelledby={CASE_STUDY_TITLE_ID}
        tabIndex={-1}
      >
        <div
          className={styles.cardWrap}
          /** Click the empty area around the card to dismiss. mousedown-on-backdrop only,
           * so selecting text inside the card and releasing outside doesn't close it. */
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) requestClose();
          }}
        >
          <div className={`${styles.card} ${selectAiSurface ? styles.cardSelectAi : ''}`}>
            <div
              className={[
                styles.cardHeader,
                headerExtraGap ? styles.cardHeaderGhost : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <Button
                ref={closeButtonRef}
                data-case-study-close
                buttonType="button"
                variant="secondary"
                iconOnly
                icon={<CloseGlyph />}
                aria-label="Close case study"
                onClick={requestClose}
              />
            </div>
            <div className={styles.cardBody}>
              <div className={contentClass}>{children}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CloseGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        d="M4 4l8 8M12 4l-8 8"
      />
    </svg>
  );
}
