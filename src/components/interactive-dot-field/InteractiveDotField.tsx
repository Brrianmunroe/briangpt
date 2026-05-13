'use client';

import * as React from 'react';
import styles from './InteractiveDotField.module.css';

/** Grid step (px) — matches Figma / `--main-dot-grid`. */
const GRID_STEP = 16;
/** Dot radius (CSS px) — matches radial-gradient 1px stop. */
const DOT_RADIUS_CSS = 1;
/** Pointer smoothing — lower = silkier, lazier follow. */
const POINTER_LERP = 0.065;
/** When the cursor leaves `<main>`, bias the wave anchor back toward center (per frame). */
const OFF_MAIN_DECAY = 0.038;
/** Gaussian falloff width (px); larger = wider “cloth” disturbance. */
const GAUSSIAN_SIGMA_PX = 240;
/** Spatial frequency along radius for the sine ripple. */
const WAVE_SPATIAL_FREQ = 0.042;
/** Time multiplier for traveling wave. */
const WAVE_TIME_SCALE = 1.15;
/** Peak displacement (CSS px) from cursor-driven wave. */
const CURSOR_WAVE_AMP_PX = 5.5;
/** Subtle idle shimmer amplitude (CSS px). */
const AMBIENT_AMP_PX = 0.75;
/** Spatial frequency for ambient term. */
const AMBIENT_SPATIAL_FREQ = 0.028;
/** Extra draw margin so displaced dots near edges are not clipped. */
const VIEWPORT_MARGIN_PX = 48;

function subscribeReducedMotion(cb: () => void): () => void {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
}

function getReducedMotionSnapshot(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Server / SSR: assume motion OK; hydrate to real preference immediately. */
function getReducedMotionServerSnapshot(): boolean {
  return false;
}

export function usePrefersReducedMotion(): boolean {
  return React.useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );
}

function resolveDotFill(container: HTMLElement): string {
  const probe = document.createElement('span');
  probe.setAttribute('aria-hidden', 'true');
  probe.style.cssText =
    'position:absolute;left:0;top:0;width:0;height:0;overflow:hidden;visibility:hidden;background:var(--main-dot-fill)';
  container.appendChild(probe);
  const fill = getComputedStyle(probe).backgroundColor;
  container.removeChild(probe);
  return fill || 'rgba(160, 160, 160, 0.35)';
}

export function InteractiveDotField({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLElement | null>;
}) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const fillRef = React.useRef<string>('rgba(160, 160, 160, 0.35)');
  const targetRef = React.useRef({ x: 0, y: 0, inside: false });
  const smoothRef = React.useRef({ x: 0, y: 0 });
  const rafRef = React.useRef<number>(0);
  const aliveRef = React.useRef(true);
  const sizeRef = React.useRef({ w: 0, h: 0, dpr: 1 });

  const paintFrame = React.useCallback(() => {
    if (!aliveRef.current) return;
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { w: cw, h: ch, dpr } = sizeRef.current;
    if (cw <= 0 || ch <= 0) return;

    const tSec = performance.now() * 0.001;
    const tgt = targetRef.current;
    if (!tgt.inside && cw > 0 && ch > 0) {
      const hx = cw / 2;
      const hy = ch / 2;
      tgt.x += (hx - tgt.x) * OFF_MAIN_DECAY;
      tgt.y += (hy - tgt.y) * OFF_MAIN_DECAY;
    }
    const sm = smoothRef.current;
    sm.x += (tgt.x - sm.x) * POINTER_LERP;
    sm.y += (tgt.y - sm.y) * POINTER_LERP;

    const cx = sm.x;
    const cy = sm.y;
    const sigma = GAUSSIAN_SIGMA_PX;
    const inv2Sigma2 = 1 / (2 * sigma * sigma);

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cw, ch);
    ctx.fillStyle = fillRef.current;

    const startX = Math.floor((-VIEWPORT_MARGIN_PX - GRID_STEP / 2) / GRID_STEP) * GRID_STEP + GRID_STEP / 2;
    const startY = Math.floor((-VIEWPORT_MARGIN_PX - GRID_STEP / 2) / GRID_STEP) * GRID_STEP + GRID_STEP / 2;

    ctx.beginPath();
    for (let gy = startY; gy < ch + VIEWPORT_MARGIN_PX; gy += GRID_STEP) {
      for (let gx = startX; gx < cw + VIEWPORT_MARGIN_PX; gx += GRID_STEP) {
        const dx = gx - cx;
        const dy = gy - cy;
        const distSq = dx * dx + dy * dy;
        const dist = Math.sqrt(distSq) + 1e-6;
        const falloff = Math.exp(-distSq * inv2Sigma2);

        const tx = -dy / dist;
        const ty = dx / dist;

        const wave =
          Math.sin(dist * WAVE_SPATIAL_FREQ - tSec * WAVE_TIME_SCALE) * falloff * CURSOR_WAVE_AMP_PX;

        let ox = tx * wave;
        let oy = ty * wave;

        ox += Math.sin(tSec * 0.62 + gx * AMBIENT_SPATIAL_FREQ) * AMBIENT_AMP_PX;
        oy += Math.cos(tSec * 0.48 + gy * AMBIENT_SPATIAL_FREQ) * AMBIENT_AMP_PX;

        if (!tgt.inside) {
          ox *= 0.35;
          oy *= 0.35;
        }

        ctx.moveTo(gx + ox + DOT_RADIUS_CSS, gy + oy);
        ctx.arc(gx + ox, gy + oy, DOT_RADIUS_CSS, 0, Math.PI * 2);
      }
    }
    ctx.fill();

    if (aliveRef.current) {
      rafRef.current = requestAnimationFrame(paintFrame);
    }
  }, [containerRef]);

  React.useLayoutEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    aliveRef.current = true;
    fillRef.current = resolveDotFill(container);

    const syncSize = () => {
      const dpr = Math.min(window.devicePixelRatio ?? 1, 2.5);
      const w = container.clientWidth;
      const h = container.clientHeight;
      sizeRef.current = { w, h, dpr };
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      smoothRef.current = { x: w / 2, y: h / 2 };
      targetRef.current = { x: w / 2, y: h / 2, inside: false };
    };

    syncSize();

    const ro = new ResizeObserver(() => {
      syncSize();
      fillRef.current = resolveDotFill(container);
    });
    ro.observe(container);

    const onPointerMove = (e: PointerEvent) => {
      const r = container.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const inside =
        x >= -VIEWPORT_MARGIN_PX &&
        y >= -VIEWPORT_MARGIN_PX &&
        x <= r.width + VIEWPORT_MARGIN_PX &&
        y <= r.height + VIEWPORT_MARGIN_PX;
      targetRef.current = {
        x: Math.min(Math.max(x, -VIEWPORT_MARGIN_PX), r.width + VIEWPORT_MARGIN_PX),
        y: Math.min(Math.max(y, -VIEWPORT_MARGIN_PX), r.height + VIEWPORT_MARGIN_PX),
        inside,
      };
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });

    rafRef.current = requestAnimationFrame(paintFrame);

    return () => {
      aliveRef.current = false;
      ro.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [containerRef, paintFrame]);

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden />;
}
