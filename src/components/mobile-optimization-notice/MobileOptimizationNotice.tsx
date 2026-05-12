'use client';

import * as React from 'react';
import { Button } from '@/components/button/Button';
import styles from './MobileOptimizationNotice.module.css';

const STORAGE_KEY = 'mobileOptimizationNoticeDismissed';

const MOBILE_MQ = '(max-width: 860px)';

function CloseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 16 16" aria-hidden>
      <path
        d="M4 4l8 8M12 4l-8 8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function readDismissed(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return sessionStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

export function MobileOptimizationNotice() {
  const [open, setOpen] = React.useState(false);
  const closeRef = React.useRef<HTMLButtonElement>(null);

  const dismiss = React.useCallback(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, '1');
    } catch {
      /* storage unavailable */
    }
    setOpen(false);
  }, []);

  React.useEffect(() => {
    const mq = window.matchMedia(MOBILE_MQ);

    function sync() {
      setOpen(!readDismissed() && mq.matches);
    }

    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  React.useEffect(() => {
    if (!open) return undefined;
    const t = window.setTimeout(() => {
      closeRef.current?.focus();
    }, 0);
    return () => window.clearTimeout(t);
  }, [open]);

  React.useEffect(() => {
    if (!open) return undefined;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') dismiss();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, dismiss]);

  if (!open) return null;

  const titleId = 'mobile-optimization-notice-title';

  return (
    <div className={styles.root}>
      <div className={styles.scrim} aria-hidden />
      <div
        className={styles.layer}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className={styles.panel}>
          <div className={styles.header}>
            <Button
              ref={closeRef}
              variant="secondary"
              iconOnly
              aria-label="Close mobile notice"
              showIcon={false}
              icon={<CloseIcon />}
              onClick={dismiss}
              buttonType="button"
            />
          </div>
          <h2 className={styles.title} id={titleId}>
            Your phone caught this site
            <br />
            mid-glow-up.
          </h2>
          <p className={styles.body}>
            I am in the process of optimizing the desktop-based version because that&apos;s where most of the traffic comes from. Thank you for your patience as I develop the mobile-optimized version.
          </p>
        </div>
      </div>
    </div>
  );
}
