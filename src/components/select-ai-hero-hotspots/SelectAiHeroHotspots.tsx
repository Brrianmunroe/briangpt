'use client';

import type { CSSProperties } from 'react';
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

/**
 * Positions from Figma Frame 179 (663:83): indicator centers as % of inner `image 41` (663:84)
 * bounds (x=32, y≈33.429, w=1056, h≈659.142). Geometry only — no Figma assets in code.
 */
const HOTSPOTS: HotspotConfig[] = [
  {
    id: 'h-timeline',
    leftPct: 37.41,
    topPct: 71.84,
    corner: 'bottom-left',
    title: 'Timeline',
    body: 'Placeholder: describe how timeline selection ties to the transcript and playback.',
  },
  {
    id: 'h-transcript-top',
    leftPct: 37.41,
    topPct: 14.65,
    corner: 'top-left',
    title: 'Transcript',
    body: 'Placeholder: call out transcript-first editing and speaker blocks.',
  },
  {
    id: 'h-video-top',
    leftPct: 84.56,
    topPct: 14.65,
    corner: 'top-right',
    title: 'Program monitor',
    body: 'Placeholder: note preview, mark in/out, and transport controls.',
  },
  {
    id: 'h-video-bottom',
    leftPct: 84.56,
    topPct: 54.38,
    corner: 'bottom-right',
    title: 'Review actions',
    body: 'Placeholder: highlight accept, delete, and review affordances.',
  },
  {
    id: 'h-sidebar',
    leftPct: 11.65,
    topPct: 14.65,
    corner: 'top-left',
    title: 'Navigation',
    body: 'Placeholder: home, projects, and settings entry points.',
  },
];

export type SelectAiHeroHotspotsProps = {
  src: string;
  alt?: string;
  imgClassName: string;
};

export function SelectAiHeroHotspots({ src, alt = '', imgClassName }: SelectAiHeroHotspotsProps) {
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
            style={
              {
                left: `${spot.leftPct}%`,
                top: `${spot.topPct}%`,
                '--hotspot-stagger-index': index,
              } as CSSProperties
            }
            onMouseEnter={() => setActiveHotspotId(spot.id)}
            onMouseLeave={() => setActiveHotspotId((prev) => (prev === spot.id ? null : prev))}
          >
            <div className={stackClass}>
              <div className={styles.indicatorLayer}>
                <FeatureHighlightCardIndicator label={`${spot.title} — highlight marker`} />
              </div>
              <div className={styles.cardLayer} data-card-corner={spot.corner}>
                <FeatureHighlightCard corner={spot.corner} title={spot.title} body={spot.body} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
