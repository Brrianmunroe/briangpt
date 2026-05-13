'use client';

import { useCallback, useState } from 'react';
import { FeatureHighlightCardIndicator } from '@/components/feature-highlight-card-indicator/FeatureHighlightCardIndicator';
import {
  FeatureHighlightCard,
  type FeatureHighlightCardCorner,
} from '@/components/feature-highlight-card/FeatureHighlightCard';
import styles from './SelectAiHeroHotspots.module.css';

type HotspotConfig = {
  id: string;
  leftPct: number;
  topPct: number;
  corner: FeatureHighlightCardCorner;
  title: string;
  body: string;
};

const HOTSPOTS: HotspotConfig[] = [
  {
    id: 'h1',
    leftPct: 24,
    topPct: 30,
    corner: 'top-left',
    title: 'Transcript-first editing',
    body: 'Placeholder: call out how transcript selection ties to the timeline.',
  },
  {
    id: 'h2',
    leftPct: 72,
    topPct: 38,
    corner: 'bottom-right',
    title: 'Review controls',
    body: 'Placeholder: highlight accept / delete and how they feel in flow.',
  },
  {
    id: 'h3',
    leftPct: 52,
    topPct: 58,
    corner: 'top-right',
    title: 'Waveform cueing',
    body: 'Placeholder: tie waveform affordance to transcript accuracy.',
  },
];

export type SelectAiHeroHotspotsProps = {
  src: string;
  alt?: string;
  imgClassName: string;
  /** Optional: show media on the first hotspot’s highlight card using the same hero image */
  demoMedia?: boolean;
};

export function SelectAiHeroHotspots({ src, alt = '', imgClassName, demoMedia }: SelectAiHeroHotspotsProps) {
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
    <div
      className={wrapClass}
      onMouseEnter={onWrapEnter}
      onMouseLeave={onWrapLeave}
    >
      <img src={src} alt={alt} className={[styles.heroImg, imgClassName].filter(Boolean).join(' ')} />
      <div className={styles.overlay} aria-hidden />
      {HOTSPOTS.map((spot, index) => {
        const expanded = imageActive && activeHotspotId === spot.id;
        const stackClass = [styles.stack, expanded ? styles.stackExpanded : ''].filter(Boolean).join(' ');

        return (
          <div
            key={spot.id}
            className={styles.hotspot}
            data-index={index}
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
                  mediaSrc={demoMedia && index === 0 ? src : undefined}
                  mediaAlt={demoMedia && index === 0 ? alt : ''}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
