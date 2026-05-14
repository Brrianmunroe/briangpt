'use client';

import { useCallback, useState } from 'react';
import { FeatureHighlightCardIndicator } from '@/components/feature-highlight-card-indicator/FeatureHighlightCardIndicator';
import {
  FeatureHighlightCard,
  type FeatureHighlightCardCorner,
  type FeatureHighlightMediaKind,
} from '@/components/feature-highlight-card/FeatureHighlightCard';
import styles from './HeroImageHotspots.module.css';

export type HeroHotspotConfig = {
  id: string;
  leftPct: number;
  topPct: number;
  corner: FeatureHighlightCardCorner;
  title: string;
  body: string;
  mediaSrc?: string;
  mediaKind?: FeatureHighlightMediaKind;
  mediaAlt?: string;
};

export type HeroImageHotspotsProps = {
  src: string;
  alt?: string;
  imgClassName: string;
  hotspots: readonly HeroHotspotConfig[];
};

export function HeroImageHotspots({ src, alt = '', imgClassName, hotspots }: HeroImageHotspotsProps) {
  const [imageActive, setImageActive] = useState(false);
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(null);

  const onWrapEnter = useCallback(() => {
    setImageActive(true);
  }, []);

  const onWrapLeave = useCallback(() => {
    setImageActive(false);
    setActiveHotspotId(null);
  }, []);

  const wrapClass = [styles.heroWrap, imageActive ? styles.wrapActive : ''].filter(Boolean).join(' ');

  return (
    <div className={wrapClass} onMouseEnter={onWrapEnter} onMouseLeave={onWrapLeave}>
      <img src={src} alt={alt} className={[styles.heroImg, imgClassName].filter(Boolean).join(' ')} />
      <div className={styles.overlay} aria-hidden />
      {hotspots.map((spot) => {
        const expanded = imageActive && activeHotspotId === spot.id;
        const stackClass = [styles.stack, expanded ? styles.stackExpanded : ''].filter(Boolean).join(' ');

        return (
          <div
            key={spot.id}
            className={styles.hotspot}
            style={{ left: `${spot.leftPct}%`, top: `${spot.topPct}%` }}
            onMouseEnter={() => setActiveHotspotId(spot.id)}
            onMouseLeave={() => setActiveHotspotId((prev) => (prev === spot.id ? null : prev))}
          >
            <div className={stackClass}>
              <div className={styles.indicatorLayer}>
                <FeatureHighlightCardIndicator label={`${spot.title} — highlight marker`} />
              </div>
              <div className={styles.cardLayer} data-card-corner={spot.corner}>
                <FeatureHighlightCard
                  corner={spot.corner}
                  title={spot.title}
                  body={spot.body}
                  mediaSrc={spot.mediaSrc}
                  mediaKind={spot.mediaKind}
                  mediaAlt={spot.mediaAlt ?? ''}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
