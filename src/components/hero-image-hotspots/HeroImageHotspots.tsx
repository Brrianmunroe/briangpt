'use client';

import { useCallback, useRef, useState } from 'react';
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
  const wrapRef = useRef<HTMLDivElement>(null);
  const [imageActive, setImageActive] = useState(false);
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(null);

  const onWrapEnter = useCallback(() => {
    setImageActive(true);
  }, []);

  const onWrapLeave = useCallback(() => {
    if (wrapRef.current?.contains(document.activeElement)) return;
    setImageActive(false);
    setActiveHotspotId(null);
  }, []);

  const wrapClass = [styles.heroWrap, imageActive ? styles.wrapActive : ''].filter(Boolean).join(' ');

  return (
    <div
      ref={wrapRef}
      className={wrapClass}
      onMouseEnter={onWrapEnter}
      onMouseLeave={onWrapLeave}
      onBlur={(event) => {
        if (event.relatedTarget instanceof Node && event.currentTarget.contains(event.relatedTarget)) {
          return;
        }
        setImageActive(false);
        setActiveHotspotId(null);
      }}
      onKeyDown={(event) => {
        if (event.key !== 'Escape' || activeHotspotId == null) return;
        event.preventDefault();
        setActiveHotspotId(null);
      }}
    >
      <img src={src} alt={alt} className={[styles.heroImg, imgClassName].filter(Boolean).join(' ')} />
      <div className={styles.overlay} aria-hidden />
      {hotspots.map((spot) => {
        const expanded = imageActive && activeHotspotId === spot.id;
        const stackClass = [styles.stack, expanded ? styles.stackExpanded : ''].filter(Boolean).join(' ');
        const hotspotClass = [styles.hotspot, expanded ? styles.hotspotActive : ''].filter(Boolean).join(' ');

        return (
          <div
            key={spot.id}
            className={hotspotClass}
            style={{ left: `${spot.leftPct}%`, top: `${spot.topPct}%` }}
            onMouseEnter={() => setActiveHotspotId(spot.id)}
            onMouseLeave={() => setActiveHotspotId((prev) => (prev === spot.id ? null : prev))}
          >
            <div className={stackClass}>
              <button
                type="button"
                className={`${styles.indicatorLayer} ${styles.indicatorButton}`}
                aria-label={`${spot.title} feature highlight`}
                aria-expanded={expanded}
                aria-controls={`desktop-hotspot-${spot.id}`}
                onFocus={() => setImageActive(true)}
                onClick={() => {
                  setImageActive(true);
                  setActiveHotspotId((current) => current === spot.id ? null : spot.id);
                }}
              >
                <FeatureHighlightCardIndicator />
              </button>
              <div
                id={`desktop-hotspot-${spot.id}`}
                className={styles.cardLayer}
                data-card-corner={spot.corner}
                aria-hidden={!expanded}
              >
                <FeatureHighlightCard
                  corner={spot.corner}
                  title={spot.title}
                  body={spot.body}
                  mediaSrc={spot.mediaSrc}
                  mediaKind={spot.mediaKind}
                  mediaAlt={spot.mediaAlt ?? ''}
                  active={expanded}
                />
              </div>
            </div>
          </div>
        );
      })}

      <div className={styles.mobileHotspotList} role="list" aria-label="Feature highlights">
        {hotspots.map((spot) => {
          const expanded = activeHotspotId === spot.id;
          return (
            <div key={spot.id} className={styles.mobileHotspotItem} role="listitem">
              <button
                type="button"
                className={styles.mobileHotspotTrigger}
                aria-expanded={expanded}
                aria-controls={`mobile-hotspot-${spot.id}`}
                onClick={() => setActiveHotspotId((current) => current === spot.id ? null : spot.id)}
              >
                <span>{spot.title}</span>
                <span className={styles.mobileHotspotGlyph} aria-hidden>
                  {expanded ? '−' : '+'}
                </span>
              </button>
              {expanded ? (
                <div id={`mobile-hotspot-${spot.id}`} className={styles.mobileHotspotCard}>
                  <FeatureHighlightCard
                    corner={spot.corner}
                    title={spot.title}
                    body={spot.body}
                    mediaSrc={spot.mediaSrc}
                    mediaKind={spot.mediaKind}
                    mediaAlt={spot.mediaAlt ?? ''}
                    active
                  />
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
