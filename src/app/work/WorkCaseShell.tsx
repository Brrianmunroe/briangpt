'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/button/Button';
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
}: {
  children: React.ReactNode;
  scaleBackground?: boolean;
  /** Extra space below the header close (SelectAI). */
  headerExtraGap?: boolean;
}) {
  const router = useRouter();
  const sceneRef = React.useRef<HTMLDivElement | null>(null);
  const [surfaceReady, setSurfaceReady] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  const [exiting, setExiting] = React.useState(false);
  const [transitioning, setTransitioning] = React.useState(false);
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
  }, []);

  React.useEffect(() => () => clearTimers(), [clearTimers]);

  React.useEffect(() => {
    if (!scaleBackground) return;
    if (typeof document === 'undefined') return;
    const body = document.body;
    if (!surfaceReady) return;
    body.dataset.caseModalState = exiting ? 'closing' : visible ? 'open' : 'opening';
    return () => {
      if (!exiting) delete body.dataset.caseModalState;
    };
  }, [scaleBackground, surfaceReady, visible, exiting]);

  const finishClose = React.useCallback(() => {
    clearTimers();
    if (scaleBackground && typeof document !== 'undefined') {
      delete document.body.dataset.caseModalState;
    }
    /** Intercepted modal routes share history with `/`; `back()` clears the slot reliably. `push('/')` can leave a transparent layer catching clicks. */
    if (scaleBackground) {
      router.back();
    } else {
      router.push('/');
    }
  }, [clearTimers, scaleBackground, router]);

  const requestClose = React.useCallback(() => {
    if (exiting) return;
    setExiting(true);
    setTransitioning(true);
    const ms = motionReduced()
      ? Math.max(1, Math.round(EXIT_MS_FALLBACK / 2))
      : parseWorkShellDurationMs(sceneRef.current, '--work-modal-exit-duration', EXIT_MS_FALLBACK);
    exitTimerRef.current = setTimeout(finishClose, ms);
  }, [exiting, finishClose]);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      requestClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [requestClose]);

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

  return (
    <div ref={sceneRef} className={styles.scene}>
      <button
        type="button"
        className={scrimClass}
        aria-label="Close case study"
        onClick={requestClose}
      />
      <div className={modalClass}>
        <div className={styles.cardWrap}>
          <div className={styles.card}>
            <div
              className={[
                styles.cardHeader,
                headerExtraGap ? styles.cardHeaderGhost : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <Button
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