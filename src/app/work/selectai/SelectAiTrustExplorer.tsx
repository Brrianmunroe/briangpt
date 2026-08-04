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
  placement: TrustPlacement;
};

type TrustPlacement = {
  x: number;
  y: number;
  scale: number;
  focusX: number;
  focusY: number;
  fit: 'cover' | 'contain';
};

const FEATURES: readonly TrustFeature[] = [
  {
    title: 'A creative brief keeps the editor in control',
    label: 'Context Brief',
    body: 'Editors define the story, audience, and key themes before AI reviews their footage.',
    media: selectAiImg.decisionBrief,
    mediaType: 'image',
    mediaAlt: 'Creative brief form in SelexAI',
    placement: { x: 240, y: -3, scale: 1.5, focusX: 0, focusY: 50, fit: 'cover' },
  },
  {
    title: 'A familiar professional layout',
    label: 'Familiar Layout',
    body: 'Established editing patterns make the workflow immediately understandable to experienced editors.',
    media: selectAiImg.nlesHighlightVideo,
    mediaType: 'video',
    mediaAlt: 'Comparison with familiar professional editing applications',
    placement: { x: 90, y: 2, scale: 1.27, focusX: 0, focusY: 45, fit: 'contain' },
  },
  {
    title: 'Visible reasoning builds confidence',
    label: 'Transparent Reasoning',
    body: 'Editors can see why each highlight was selected and how it supports the larger story.',
    media: selectAiImg.reasoningHighlightVideo,
    mediaType: 'video',
    mediaAlt: 'AI reasoning attached to an interview highlight',
    placement: { x: 23, y: -4, scale: 1.21, focusX: 50, focusY: 50, fit: 'cover' },
  },
  {
    title: 'Transcript and timeline stay connected',
    label: 'Tandem Timeline',
    body: 'Every selection remains synchronized across transcript, playback, and timeline views.',
    media: selectAiImg.tandemTimelineHighlightVideo,
    mediaType: 'video',
    mediaAlt: 'Transcript and timeline editing working in tandem',
    placement: { x: 59, y: 2, scale: 1.19, focusX: 50, focusY: 50, fit: 'cover' },
  },
  {
    title: 'A native-feeling toolbar',
    label: 'Native Controls',
    body: 'Familiar controls and shortcuts let editors work without relearning their craft.',
    media: selectAiImg.toolbarHighlightVideo,
    mediaType: 'video',
    mediaAlt: 'SelexAI toolbar and playback controls',
    placement: { x: 95, y: -6, scale: 1.23, focusX: 50, focusY: 50, fit: 'cover' },
  },
  {
    title: 'Exporting keeps the product focused',
    label: 'Export to NLE',
    body: 'SelexAI handles the slowest review step, then returns the timeline to the editor’s preferred NLE.',
    media: selectAiImg.decisionExport,
    mediaType: 'image',
    mediaAlt: 'SelexAI export options for professional editing tools',
    placement: { x: 52, y: -6, scale: 1.32, focusX: 50, focusY: 50, fit: 'cover' },
  },
] as const;

const TRANSITION_MS = 620;
const PLACEMENT_STORAGE_KEY = 'selexai-trust-media-placement-v1';

export function SelectAiTrustExplorer() {
  const [activeIndex, setActiveIndex] = React.useState(1);
  const [previousIndex, setPreviousIndex] = React.useState<number | null>(null);
  const [direction, setDirection] = React.useState<1 | -1>(1);
  const [editorEnabled, setEditorEnabled] = React.useState(false);
  const [copyStatus, setCopyStatus] = React.useState('Copy values');
  const [placements, setPlacements] = React.useState<TrustPlacement[]>(
    () => FEATURES.map((feature) => ({ ...feature.placement })),
  );

  React.useEffect(() => {
    const enabled = new URLSearchParams(window.location.search).get('mediaEdit') === '1';
    setEditorEnabled(enabled);
    if (!enabled) return;

    try {
      const stored = window.localStorage.getItem(PLACEMENT_STORAGE_KEY);
      if (!stored) return;
      const parsed = JSON.parse(stored) as TrustPlacement[];
      if (Array.isArray(parsed) && parsed.length === FEATURES.length) setPlacements(parsed);
    } catch {
      window.localStorage.removeItem(PLACEMENT_STORAGE_KEY);
    }
  }, []);

  React.useEffect(() => {
    if (!editorEnabled) return;
    window.localStorage.setItem(PLACEMENT_STORAGE_KEY, JSON.stringify(placements));
  }, [editorEnabled, placements]);

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
    setCopyStatus('Copy values');
  };

  const updatePlacement = (index: number, patch: Partial<TrustPlacement>) => {
    setPlacements((current) => current.map((placement, placementIndex) => (
      placementIndex === index ? { ...placement, ...patch } : placement
    )));
  };

  const resetPlacement = () => {
    updatePlacement(activeIndex, FEATURES[activeIndex].placement);
    setCopyStatus('Copy values');
  };

  const copyPlacement = async () => {
    const value = `placement: ${JSON.stringify(placements[activeIndex])}`;
    try {
      await navigator.clipboard.writeText(value);
      setCopyStatus('Copied');
    } catch {
      setCopyStatus('Copy failed');
    }
  };

  const activeFeature = FEATURES[activeIndex];
  const previousFeature = previousIndex == null ? null : FEATURES[previousIndex];
  const previousPlacement = previousIndex == null ? null : placements[previousIndex];

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
                <span className={styles.trustTabMarker} aria-hidden>
                  <svg viewBox="0 0 20 20" focusable="false">
                    <path d="M4.5 10h11" />
                    {!active ? <path d="M10 4.5v11" /> : null}
                  </svg>
                </span>
                <span>{feature.label}</span>
              </span>
              <span className={styles.trustTabDetails} aria-hidden={!active}>
                <span>{feature.body}</span>
              </span>
            </button>
          );
        })}
      </div>

      <div
        className={`${styles.trustMediaPanel} ${editorEnabled ? styles.trustMediaPanelEditing : ''}`}
        id="trust-feature-panel"
        role="tabpanel"
        aria-labelledby={`trust-tab-${activeIndex}`}
      >
        {previousFeature && previousPlacement ? (
          <TrustMedia
            key={`out-${previousIndex}`}
            feature={previousFeature}
            className={`${styles.trustMediaLayer} ${styles.trustMediaExit}`}
            direction={direction}
            placement={previousPlacement}
          />
        ) : null}
        <TrustMedia
          key={`in-${activeIndex}`}
          feature={activeFeature}
          className={`${styles.trustMediaLayer} ${styles.trustMediaEnter}`}
          direction={direction}
          placement={placements[activeIndex]}
          onPlacementChange={editorEnabled ? (patch) => updatePlacement(activeIndex, patch) : undefined}
          active
        />
      </div>

      {editorEnabled ? (
        <MediaPlacementControls
          placement={placements[activeIndex]}
          onChange={(patch) => updatePlacement(activeIndex, patch)}
          onReset={resetPlacement}
          onCopy={copyPlacement}
          copyStatus={copyStatus}
        />
      ) : null}
    </div>
  );
}

function TrustMedia({
  feature,
  className,
  direction,
  placement,
  onPlacementChange,
  active = false,
}: {
  feature: TrustFeature;
  className: string;
  direction: 1 | -1;
  placement: TrustPlacement;
  onPlacementChange?: (patch: Partial<TrustPlacement>) => void;
  active?: boolean;
}) {
  const directionClass = direction === 1 ? styles.trustMediaForward : styles.trustMediaBackward;
  const dragStart = React.useRef<{ pointerX: number; pointerY: number; x: number; y: number } | null>(null);
  const placementStyle = {
    '--trust-media-x': `${placement.x}px`,
    '--trust-media-y': `${placement.y}px`,
    '--trust-media-scale': placement.scale,
    '--trust-media-object-position': `${placement.focusX}% ${placement.focusY}%`,
    '--trust-media-fit': placement.fit,
  } as React.CSSProperties;

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!onPlacementChange) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragStart.current = {
      pointerX: event.clientX,
      pointerY: event.clientY,
      x: placement.x,
      y: placement.y,
    };
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!onPlacementChange || !dragStart.current) return;
    onPlacementChange({
      x: Math.round(dragStart.current.x + event.clientX - dragStart.current.pointerX),
      y: Math.round(dragStart.current.y + event.clientY - dragStart.current.pointerY),
    });
  };

  const stopDragging = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    dragStart.current = null;
  };

  return (
    <div className={`${className} ${directionClass}`} aria-hidden={!active}>
      <div
        className={`${styles.trustMediaStage} ${onPlacementChange ? styles.trustMediaStageEditable : ''}`}
        style={placementStyle}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={stopDragging}
        onPointerCancel={stopDragging}
      >
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

function MediaPlacementControls({
  placement,
  onChange,
  onReset,
  onCopy,
  copyStatus,
}: {
  placement: TrustPlacement;
  onChange: (patch: Partial<TrustPlacement>) => void;
  onReset: () => void;
  onCopy: () => void;
  copyStatus: string;
}) {
  return (
    <aside className={styles.trustMediaControls} aria-label="Media placement controls">
      <div className={styles.trustMediaControlsHeader}>
        <strong>Media placement</strong>
        <span>Drag the media directly</span>
      </div>

      <PlacementRange label="X" value={placement.x} min={-240} max={240} step={1} onChange={(x) => onChange({ x })} />
      <PlacementRange label="Y" value={placement.y} min={-180} max={180} step={1} onChange={(y) => onChange({ y })} />
      <PlacementRange label="Scale" value={placement.scale} min={0.5} max={2} step={0.01} onChange={(scale) => onChange({ scale })} />
      <PlacementRange label="Focus X" value={placement.focusX} min={0} max={100} step={1} onChange={(focusX) => onChange({ focusX })} />
      <PlacementRange label="Focus Y" value={placement.focusY} min={0} max={100} step={1} onChange={(focusY) => onChange({ focusY })} />

      <label className={styles.trustMediaSelectRow}>
        <span>Fit</span>
        <select value={placement.fit} onChange={(event) => onChange({ fit: event.target.value as TrustPlacement['fit'] })}>
          <option value="cover">Cover</option>
          <option value="contain">Contain</option>
        </select>
      </label>

      <div className={styles.trustMediaControlActions}>
        <button type="button" onClick={onReset}>Reset</button>
        <button type="button" onClick={onCopy}>{copyStatus}</button>
      </div>
    </aside>
  );
}

function PlacementRange({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className={styles.trustMediaRange}>
      <span>{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <output>{Number.isInteger(value) ? value : value.toFixed(2)}</output>
    </label>
  );
}
