'use client';

import * as React from 'react';
import { selectAiImg } from './select-ai-assets';
import styles from './select-ai-case-study.module.css';

type TrustFeature = {
  title: string;
  label: string;
  body: string;
  media: string;
  mediaType: 'image' | 'video';
  mediaAlt: string;
};

const FEATURES: readonly TrustFeature[] = [
  {
    title: 'A creative brief keeps the editor in control',
    label: 'Context Brief',
    body: 'Editors define the story, audience, and key themes before AI reviews their footage.',
    media: selectAiImg.decisionBrief,
    mediaType: 'image',
    mediaAlt: 'Creative brief form in SelexAI',
  },
  {
    title: 'A familiar professional layout',
    label: 'Familiar Layout',
    body: 'Established editing patterns make the workflow immediately understandable to experienced editors.',
    media: selectAiImg.nlesHighlightVideo,
    mediaType: 'video',
    mediaAlt: 'Comparison with familiar professional editing applications',
  },
  {
    title: 'Visible reasoning builds confidence',
    label: 'Transparent Reasoning',
    body: 'Editors can see why each highlight was selected and how it supports the larger story.',
    media: selectAiImg.reasoningHighlightVideo,
    mediaType: 'video',
    mediaAlt: 'AI reasoning attached to an interview highlight',
  },
  {
    title: 'Transcript and timeline stay connected',
    label: 'Tandem Timeline',
    body: 'Every selection remains synchronized across transcript, playback, and timeline views.',
    media: selectAiImg.tandemTimelineHighlightVideo,
    mediaType: 'video',
    mediaAlt: 'Transcript and timeline editing working in tandem',
  },
  {
    title: 'A native-feeling toolbar',
    label: 'Native Controls',
    body: 'Familiar controls and shortcuts let editors work without relearning their craft.',
    media: selectAiImg.toolbarHighlightVideo,
    mediaType: 'video',
    mediaAlt: 'SelexAI toolbar and playback controls',
  },
  {
    title: 'Exporting keeps the product focused',
    label: 'Export to NLE',
    body: 'SelexAI handles the slowest review step, then returns the timeline to the editor’s preferred NLE.',
    media: selectAiImg.decisionExport,
    mediaType: 'image',
    mediaAlt: 'SelexAI export options for professional editing tools',
  },
] as const;

const TRANSITION_MS = 520;

export function SelectAiTrustExplorer() {
  const [activeIndex, setActiveIndex] = React.useState(1);
  const [previousIndex, setPreviousIndex] = React.useState<number | null>(null);
  const [direction, setDirection] = React.useState<1 | -1>(1);

  React.useEffect(() => {
    if (previousIndex == null) return;
    const timer = window.setTimeout(() => setPreviousIndex(null), TRANSITION_MS);
    return () => window.clearTimeout(timer);
  }, [activeIndex, previousIndex]);

  const selectFeature = (index: number) => {
    if (index === activeIndex) return;
    setDirection(index > activeIndex ? 1 : -1);
    setPreviousIndex(activeIndex);
    setActiveIndex(index);
  };

  const activeFeature = FEATURES[activeIndex];
  const previousFeature = previousIndex == null ? null : FEATURES[previousIndex];

  return (
    <div className={styles.trustExplorer}>
      <div className={styles.trustNavigation} role="tablist" aria-label="SelexAI trust features">
        {FEATURES.map((feature, index) => {
          const active = index === activeIndex;
          return (
            <button
              key={feature.title}
              className={`${styles.trustTab} ${active ? styles.trustTabActive : ''}`}
              type="button"
              role="tab"
              id={`trust-tab-${index}`}
              aria-selected={active}
              aria-label={`${feature.label}: ${feature.body}`}
              aria-controls="trust-feature-panel"
              tabIndex={active ? 0 : -1}
              onClick={() => selectFeature(index)}
              onKeyDown={(event) => {
                const forward = event.key === 'ArrowDown' || event.key === 'ArrowRight';
                const backward = event.key === 'ArrowUp' || event.key === 'ArrowLeft';
                if (!forward && !backward) return;
                event.preventDefault();
                const offset = forward ? 1 : -1;
                const nextIndex = (index + offset + FEATURES.length) % FEATURES.length;
                selectFeature(nextIndex);
                document.getElementById(`trust-tab-${nextIndex}`)?.focus();
              }}
            >
              <span className={styles.trustTabHeader}>
                <span className={styles.trustTabMarker} aria-hidden>{active ? '−' : '+'}</span>
                <span>{feature.label}</span>
              </span>
              <span className={styles.trustTabDetails} aria-hidden={!active}>
                <span>
                  <strong>{feature.title}</strong>
                  {feature.body}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div
        className={styles.trustMediaPanel}
        id="trust-feature-panel"
        role="tabpanel"
        aria-labelledby={`trust-tab-${activeIndex}`}
      >
        {previousFeature ? (
          <TrustMedia
            key={`out-${previousIndex}`}
            feature={previousFeature}
            className={`${styles.trustMediaLayer} ${styles.trustMediaExit}`}
            direction={direction}
          />
        ) : null}
        <TrustMedia
          key={`in-${activeIndex}`}
          feature={activeFeature}
          className={`${styles.trustMediaLayer} ${styles.trustMediaEnter}`}
          direction={direction}
          active
        />
      </div>
    </div>
  );
}

function TrustMedia({
  feature,
  className,
  direction,
  active = false,
}: {
  feature: TrustFeature;
  className: string;
  direction: 1 | -1;
  active?: boolean;
}) {
  const directionClass = direction === 1 ? styles.trustMediaForward : styles.trustMediaBackward;

  return (
    <div className={`${className} ${directionClass}`} aria-hidden={!active}>
      <div className={styles.trustMediaStage}>
        {feature.mediaType === 'video' ? (
          <video
            src={feature.media}
            aria-label={feature.mediaAlt}
            autoPlay={active}
            muted
            loop
            playsInline
            preload="metadata"
          />
        ) : (
          <img src={feature.media} alt={active ? feature.mediaAlt : ''} />
        )}
      </div>
    </div>
  );
}
