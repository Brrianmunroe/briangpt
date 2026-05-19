'use client';

import * as React from 'react';
import { Close } from '@/components/icons';
import styles from './ChatErrorBanner.module.css';

export type ChatErrorBannerProps = {
  children: React.ReactNode;
  onDismiss?: () => void;
  className?: string;
  /** Re-mount animation when error identity changes (e.g. error message). */
  animationKey?: string;
};

function mergeClassNames(...parts: Array<string | undefined>) {
  return parts.filter(Boolean).join(' ');
}

const MULTILINE_SLOP_PX = 2;

export function ChatErrorBanner({
  children,
  onDismiss,
  className,
  animationKey,
}: ChatErrorBannerProps) {
  const messageRef = React.useRef<HTMLParagraphElement>(null);
  const [multiline, setMultiline] = React.useState(false);

  const measureLayout = React.useCallback(() => {
    const el = messageRef.current;
    if (!el) return;
    const lineHeight = Number.parseFloat(getComputedStyle(el).lineHeight);
    if (!Number.isFinite(lineHeight) || lineHeight <= 0) return;
    setMultiline(el.scrollHeight > lineHeight + MULTILINE_SLOP_PX);
  }, []);

  React.useLayoutEffect(() => {
    measureLayout();
  }, [children, animationKey, measureLayout]);

  React.useEffect(() => {
    const el = messageRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => measureLayout());
    ro.observe(el);
    return () => ro.disconnect();
  }, [measureLayout]);

  return (
    <div
      key={animationKey}
      role="alert"
      className={mergeClassNames(
        styles.root,
        styles.rootEnter,
        multiline ? styles.rootMultiline : styles.rootSingleLine,
        className
      )}
    >
      <p ref={messageRef} className={styles.message}>
        {children}
      </p>
      {onDismiss ? (
        <button
          type="button"
          className={styles.dismissButton}
          onClick={onDismiss}
          aria-label="Dismiss error"
        >
          <Close size={16} aria-hidden />
        </button>
      ) : null}
    </div>
  );
}
