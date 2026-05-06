'use client';

import * as React from 'react';
import sidebarStyles from '@/components/sidebar/Sidebar.module.css';
import styles from './SidebarAnimationTuner.module.css';

/* ------------------------------------------------------------------ */
/*  Defaults — must match the values on .root in Sidebar.module.css   */
/* ------------------------------------------------------------------ */

const DEFAULTS = {
  railDuration: 0.35,
  railEase: [0.75, 0.15, 0.05, 0.70] as [number, number, number, number],
  contentDuration: 0.30,
  contentDelay: 0.10,
  contentEase: [0.75, 0.15, 0.01, 1.00] as [number, number, number, number],
  collapseDuration: 0.50,
  blurPeak: 10,
} as const;

type EasingTuple = [number, number, number, number];

const EASING_PRESETS: Record<string, EasingTuple> = {
  'ease-out': [0.0, 0.0, 0.2, 1],
  'ease-in-out': [0.42, 0.0, 0.58, 1],
  'ease-in': [0.42, 0.0, 1, 1],
  linear: [0, 0, 1, 1],
  'ease (default)': [0.25, 0.1, 0.25, 1],
  'spring-like': [0.2, 1.4, 0.3, 1],
};

/* ------------------------------------------------------------------ */
/*  Tiny SVG bezier preview                                           */
/* ------------------------------------------------------------------ */

function BezierPreview({ pts }: { pts: EasingTuple }) {
  const [x1, y1, x2, y2] = pts;
  const pad = 4;
  const size = 48;
  const inner = size - pad * 2;
  const sx = (v: number) => pad + v * inner;
  const sy = (v: number) => pad + (1 - v) * inner;

  const d = `M ${sx(0)} ${sy(0)} C ${sx(x1)} ${sy(y1)}, ${sx(x2)} ${sy(y2)}, ${sx(1)} ${sy(1)}`;

  return (
    <svg className={styles.easingPreview} viewBox={`0 0 ${size} ${size}`} aria-hidden>
      <rect
        x={pad}
        y={pad}
        width={inner}
        height={inner}
        className={styles.easingPreviewFrame}
        rx={2}
      />
      <path d={d} className={styles.easingPreviewPath} />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Style injection — writes overrides into a <style> in <head>       */
/* ------------------------------------------------------------------ */

function useStyleInjection(css: string) {
  const idRef = React.useRef<string>('sidebar-tuner-overrides');
  React.useEffect(() => {
    let el = document.getElementById(idRef.current) as HTMLStyleElement | null;
    if (!el) {
      el = document.createElement('style');
      el.id = idRef.current;
      document.head.appendChild(el);
    }
    el.textContent = css;
    return () => {
      /* keep element alive across re-renders; removed on unmount */
    };
  }, [css]);

  React.useEffect(() => {
    return () => {
      const el = document.getElementById(idRef.current);
      if (el) el.remove();
    };
  }, []);
}

/* ------------------------------------------------------------------ */
/*  Drag hook                                                         */
/* ------------------------------------------------------------------ */

function useDraggable(initialPos: { x: number; y: number }) {
  const [pos, setPos] = React.useState(initialPos);
  const dragging = React.useRef(false);
  const offset = React.useRef({ x: 0, y: 0 });

  const onPointerDown = React.useCallback(
    (e: React.PointerEvent) => {
      if ((e.target as HTMLElement).closest('button, select, input')) return;
      dragging.current = true;
      offset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [pos],
  );

  const onPointerMove = React.useCallback((e: React.PointerEvent) => {
    if (!dragging.current) return;
    setPos({ x: e.clientX - offset.current.x, y: e.clientY - offset.current.y });
  }, []);

  const onPointerUp = React.useCallback(() => {
    dragging.current = false;
  }, []);

  return { pos, onPointerDown, onPointerMove, onPointerUp };
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

function fmtDuration(v: number) {
  return `${v.toFixed(2)}s`;
}

function fmtBlur(v: number) {
  return `${v.toFixed(1)}px`;
}

function easingToCss(pts: EasingTuple) {
  return `cubic-bezier(${pts.map((n) => n.toFixed(2)).join(', ')})`;
}

function matchPreset(pts: EasingTuple): string {
  for (const [name, preset] of Object.entries(EASING_PRESETS)) {
    if (preset.every((v, i) => Math.abs(v - pts[i]) < 0.005)) return name;
  }
  return 'custom';
}

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export function SidebarAnimationTuner() {
  const [open, setOpen] = React.useState(false);
  const [collapsed, setCollapsed] = React.useState(false);

  const [railDuration, setRailDuration] = React.useState<number>(DEFAULTS.railDuration);
  const [railEase, setRailEase] = React.useState<EasingTuple>([...DEFAULTS.railEase]);
  const [contentDuration, setContentDuration] = React.useState<number>(DEFAULTS.contentDuration);
  const [contentDelay, setContentDelay] = React.useState<number>(DEFAULTS.contentDelay);
  const [contentEase, setContentEase] = React.useState<EasingTuple>([...DEFAULTS.contentEase]);
  const [collapseDuration, setCollapseDuration] = React.useState<number>(DEFAULTS.collapseDuration);
  const [blurPeak, setBlurPeak] = React.useState<number>(DEFAULTS.blurPeak);

  const [copied, setCopied] = React.useState(false);

  const sidebarRootClass = sidebarStyles.root;

  const cssOverrides = React.useMemo(() => {
    return `.${sidebarRootClass} {
  --sidebar-rail-duration: ${fmtDuration(railDuration)};
  --sidebar-rail-ease: ${easingToCss(railEase)};
  --sidebar-content-duration: ${fmtDuration(contentDuration)};
  --sidebar-content-delay: ${fmtDuration(contentDelay)};
  --sidebar-content-ease: ${easingToCss(contentEase)};
  --sidebar-collapse-duration: ${fmtDuration(collapseDuration)};
  --sidebar-blur-peak: ${fmtBlur(blurPeak)};
}`;
  }, [
    sidebarRootClass,
    railDuration,
    railEase,
    contentDuration,
    contentDelay,
    contentEase,
    collapseDuration,
    blurPeak,
  ]);

  useStyleInjection(open ? cssOverrides : '');

  const drag = useDraggable({
    x: typeof window !== 'undefined' ? window.innerWidth - 364 : 400,
    y: typeof window !== 'undefined' ? window.innerHeight - 520 : 200,
  });

  const reset = React.useCallback(() => {
    setRailDuration(DEFAULTS.railDuration);
    setRailEase([...DEFAULTS.railEase]);
    setContentDuration(DEFAULTS.contentDuration);
    setContentDelay(DEFAULTS.contentDelay);
    setContentEase([...DEFAULTS.contentEase]);
    setCollapseDuration(DEFAULTS.collapseDuration);
    setBlurPeak(DEFAULTS.blurPeak);
  }, []);

  const copyCss = React.useCallback(async () => {
    const snippet = `:root {\n  --sidebar-rail-duration: ${fmtDuration(railDuration)};\n  --sidebar-rail-ease: ${easingToCss(railEase)};\n  --sidebar-content-duration: ${fmtDuration(contentDuration)};\n  --sidebar-content-delay: ${fmtDuration(contentDelay)};\n  --sidebar-content-ease: ${easingToCss(contentEase)};\n  --sidebar-collapse-duration: ${fmtDuration(collapseDuration)};\n  --sidebar-blur-peak: ${fmtBlur(blurPeak)};\n}`;
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard not available */
    }
  }, [railDuration, railEase, contentDuration, contentDelay, contentEase, collapseDuration, blurPeak]);

  const updateEasing = React.useCallback(
    (setter: React.Dispatch<React.SetStateAction<EasingTuple>>, idx: number, raw: string) => {
      const v = parseFloat(raw);
      if (Number.isNaN(v)) return;
      const clamped = idx % 2 === 0 ? clamp(v, 0, 1) : clamp(v, -0.5, 1.5);
      setter((prev) => {
        const next = [...prev] as EasingTuple;
        next[idx] = clamped;
        return next;
      });
    },
    [],
  );

  return (
    <>
      {/* Floating action button */}
      <button
        type="button"
        className={`${styles.fab} ${open ? styles.fabHidden : ''}`}
        onClick={() => setOpen(true)}
        aria-label="Open animation tuner"
        title="Animation tuner"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
          <path
            d="M2 5h4M10 5h6M2 9h8M14 9h2M2 13h2M8 13h8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle cx="8" cy="5" r="2" fill="currentColor" />
          <circle cx="12" cy="9" r="2" fill="currentColor" />
          <circle cx="6" cy="13" r="2" fill="currentColor" />
        </svg>
      </button>

      {/* Panel */}
      {open ? (
        <div
          className={`${styles.panel} ${collapsed ? styles.panelCollapsed : ''}`}
          style={{ left: drag.pos.x, top: drag.pos.y }}
        >
          {/* Drag handle / title bar */}
          <div
            className={styles.handle}
            onPointerDown={drag.onPointerDown}
            onPointerMove={drag.onPointerMove}
            onPointerUp={drag.onPointerUp}
          >
            <span className={styles.handleTitle}>Animation Tuner</span>
            <span className={styles.handleButtons}>
              <button
                type="button"
                className={styles.handleBtn}
                onClick={() => setCollapsed((c) => !c)}
                aria-label={collapsed ? 'Expand panel' : 'Collapse panel'}
                title={collapsed ? 'Expand' : 'Collapse'}
              >
                {collapsed ? '▼' : '▲'}
              </button>
              <button
                type="button"
                className={styles.handleBtn}
                onClick={() => setOpen(false)}
                aria-label="Close tuner"
                title="Close"
              >
                ✕
              </button>
            </span>
          </div>

          {/* Body */}
          <div className={`${styles.body} ${collapsed ? styles.bodyHidden : ''}`}>
            {/* --- Expand section --- */}
            <div className={styles.sectionHeader}>Expand (open)</div>

            <SliderRow
              label="Rail duration"
              value={railDuration}
              min={0}
              max={1}
              step={0.01}
              format={fmtDuration}
              onChange={setRailDuration}
            />

            <EasingGroup
              label="Rail easing"
              value={railEase}
              onChange={setRailEase}
              onUpdatePoint={(idx, raw) => updateEasing(setRailEase, idx, raw)}
            />

            <SliderRow
              label="Content delay"
              value={contentDelay}
              min={0}
              max={1}
              step={0.01}
              format={fmtDuration}
              onChange={setContentDelay}
            />

            <SliderRow
              label="Content duration"
              value={contentDuration}
              min={0}
              max={1}
              step={0.01}
              format={fmtDuration}
              onChange={setContentDuration}
            />

            <EasingGroup
              label="Content easing"
              value={contentEase}
              onChange={setContentEase}
              onUpdatePoint={(idx, raw) => updateEasing(setContentEase, idx, raw)}
            />

            {/* --- Collapse section --- */}
            <div className={styles.sectionHeader}>Collapse (close)</div>

            <SliderRow
              label="Collapse duration"
              value={collapseDuration}
              min={0}
              max={1}
              step={0.01}
              format={fmtDuration}
              onChange={setCollapseDuration}
            />

            {/* --- Blur --- */}
            <div className={styles.sectionHeader}>Blur</div>

            <SliderRow
              label="Blur peak"
              value={blurPeak}
              min={0}
              max={20}
              step={0.5}
              format={fmtBlur}
              onChange={setBlurPeak}
            />

            {/* --- Actions --- */}
            <div className={styles.actions}>
              <button type="button" className={styles.actionBtn} onClick={reset}>
                Reset
              </button>
              <button
                type="button"
                className={`${styles.actionBtn} ${styles.actionBtnAccent}`}
                onClick={() => void copyCss()}
              >
                {copied ? 'Copied!' : 'Copy CSS'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                    */
/* ------------------------------------------------------------------ */

function SliderRow({
  label,
  value,
  min,
  max,
  step,
  format,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
}) {
  return (
    <div className={styles.sliderRow}>
      <span className={styles.sliderLabel}>{label}</span>
      <input
        type="range"
        className={styles.sliderInput}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
      <span className={styles.sliderValue}>{format(value)}</span>
    </div>
  );
}

const EASING_POINT_LABELS = ['x1', 'y1', 'x2', 'y2'];

function EasingGroup({
  label,
  value,
  onChange,
  onUpdatePoint,
}: {
  label: string;
  value: EasingTuple;
  onChange: React.Dispatch<React.SetStateAction<EasingTuple>>;
  onUpdatePoint: (idx: number, raw: string) => void;
}) {
  const currentPreset = matchPreset(value);

  return (
    <div className={styles.easingGroup}>
      <div className={styles.easingHeader}>
        <span className={styles.easingLabel}>{label}</span>
        <select
          className={styles.presetSelect}
          value={currentPreset}
          onChange={(e) => {
            const p = EASING_PRESETS[e.target.value];
            if (p) onChange([...p] as EasingTuple);
          }}
        >
          {currentPreset === 'custom' ? <option value="custom">custom</option> : null}
          {Object.keys(EASING_PRESETS).map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.easingRow}>
        <div className={styles.easingInputs}>
          {value.map((v, i) => (
            <input
              key={i}
              type="number"
              className={styles.easingNumberInput}
              step={0.05}
              min={i % 2 === 0 ? 0 : -0.5}
              max={i % 2 === 0 ? 1 : 1.5}
              value={v}
              aria-label={EASING_POINT_LABELS[i]}
              title={EASING_POINT_LABELS[i]}
              onChange={(e) => onUpdatePoint(i, e.target.value)}
            />
          ))}
        </div>
        <BezierPreview pts={value} />
      </div>
    </div>
  );
}
