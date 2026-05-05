import * as React from 'react';
import { iconFitToDisplayRect } from './iconFrame';

/**
 * Up arrow icon — ports Figma component set `icons / up-arrow`
 * (variants Color=Black | Orange | Grey). Geometry from Plugin API `fillGeometry`
 * on node `130:102` (vector “Vector (Stroke)”).
 *
 * Fills use mapped tokens (same as Figma variable bindings):
 * - black → --color-icon-surface-black
 * - orange → --color-icon-surface-orange
 * - grey → --color-icon-surface-grey
 */

export type UpArrowColor = 'black' | 'orange' | 'grey';

export type UpArrowProps = Omit<
  React.SVGProps<SVGSVGElement>,
  'fill' | 'width' | 'height'
> & {
  /** Matches Figma variant property `Color` */
  color?: UpArrowColor;
  /** When set, overrides `color` (e.g. `var(--button-icon-fill)` from a parent `Button`). */
  fill?: string;
  /** Default 16 to match Figma frame */
  size?: number;
};

const FILL_BY_COLOR: Record<UpArrowColor, string> = {
  black: 'var(--color-icon-surface-black)',
  orange: 'var(--color-icon-surface-orange)',
  grey: 'var(--color-icon-surface-grey)',
};

const BBOX = { x: -0.0650874, y: 0.149583, w: 10.7967876, h: 10.516917 } as const;
/** 10.67 × 10.67 px (32/3 Figma grid) */
const DISPLAY = { w: 32 / 3, h: 32 / 3 } as const;

/** Path `d` from Figma `fillGeometry[0].data` (local path space) */
const UP_ARROW_PATH =
  'M4.66662 9.99984 L4.66662 2.27589 L1.13797 5.80453 C0.877621 6.06488 0.455612 6.06488 0.195262 5.80453 C-0.0650874 5.54418 -0.0650874 5.12217 0.195262 4.86182 L4.86193 0.195156 L4.91271 0.149583 C5.17456 -0.0639836 5.56056 -0.0489211 5.80464 0.195156 L10.4713 4.86182 C10.7317 5.12217 10.7317 5.54418 10.4713 5.80453 C10.211 6.06488 9.78895 6.06488 9.5286 5.80453 L5.99995 2.27589 L5.99995 9.99984 C5.99995 10.368 5.70147 10.6665 5.33328 10.6665 C4.96509 10.6665 4.66662 10.368 4.66662 9.99984 Z';

export const UpArrow = React.forwardRef<SVGSVGElement, UpArrowProps>(
  function UpArrow(
    { color = 'black', fill: fillOverride, size = 16, className, children, ...rest },
    ref
  ) {
    const labelled = Boolean(rest['aria-label']);

    return (
      <svg
        ref={ref}
        {...rest}
        width={size}
        height={size}
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        role={labelled ? 'img' : 'presentation'}
        aria-hidden={labelled ? undefined : true}
      >
        <g
          transform={iconFitToDisplayRect(
            BBOX.x,
            BBOX.y,
            BBOX.w,
            BBOX.h,
            DISPLAY.w,
            DISPLAY.h
          )}
        >
          <path d={UP_ARROW_PATH} fill={fillOverride ?? FILL_BY_COLOR[color]} />
        </g>
        {children}
      </svg>
    );
  }
);
