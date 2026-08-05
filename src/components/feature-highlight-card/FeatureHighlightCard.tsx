'use client';

import { useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from '@/lib/use-prefers-reduced-motion';
import styles from './FeatureHighlightCard.module.css';

export type FeatureHighlightCardCorner = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export type FeatureHighlightMediaKind = 'image' | 'video';

export type FeatureHighlightCardProps = {
  corner: FeatureHighlightCardCorner;
  title: string;
  body: string;
  mediaSrc?: string;
  /** Defaults to `image` when `mediaSrc` is set. */
  mediaKind?: FeatureHighlightMediaKind;
  mediaAlt?: string;
  /** When true, the card is fully expanded — video playback starts after the expand settles. */
  active?: boolean;
  className?: string;
};

/** Roughly matches the 0.38s card-expand transition; play once the card has settled. */
const VIDEO_PLAY_DELAY_MS = 420;

export function FeatureHighlightCard({
  corner,
  title,
  body,
  mediaSrc,
  mediaKind = 'image',
  mediaAlt = '',
  active = false,
  className,
}: FeatureHighlightCardProps) {
  const rootClass = [styles.root, className].filter(Boolean).join(' ');
  const videoRef = useRef<HTMLVideoElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (active && !prefersReducedMotion) {
      const timer = window.setTimeout(() => {
        video.play().catch(() => {});
      }, VIDEO_PLAY_DELAY_MS);
      return () => window.clearTimeout(timer);
    }

    // Collapsed: hold paused on the first frame for the next open.
    video.pause();
    video.currentTime = 0;
  }, [active, prefersReducedMotion]);

  return (
    <article className={rootClass} data-corner={corner}>
      {mediaSrc ? (
        <div className={styles.media}>
          {mediaKind === 'video' ? (
            <video
              ref={videoRef}
              className={styles.mediaVideo}
              src={mediaSrc}
              muted
              playsInline
              loop
              preload="auto"
              aria-label={mediaAlt || undefined}
            />
          ) : (
            <img className={styles.mediaImg} src={mediaSrc} alt={mediaAlt} />
          )}
        </div>
      ) : null}
      <div className={styles.titleRow}>
        <p className={styles.title}>{title}</p>
      </div>
      <p className={styles.body}>{body}</p>
    </article>
  );
}
