import * as React from 'react';
import { iconFitToDisplayRect } from './iconFrame';

/**
 * Stop icon — ports Figma component set `icons / stop`
 * (variants Color=Black | Orange | Grey). Geometry from Plugin API `fillGeometry`
 * on node `130:96` (Black variant).
 *
 * Fills use mapped tokens (same as Figma variable bindings):
 * - black → --color-icon-surface-black
 * - orange → --color-icon-surface-orange
 * - grey → --color-icon-surface-grey
 */

export type StopColor = 'black' | 'orange' | 'grey';

export type StopProps = Omit<
  React.SVGProps<SVGSVGElement>,
  'fill' | 'width' | 'height'
> & {
  color?: StopColor;
  size?: number;
};

const FILL_BY_COLOR: Record<StopColor, string> = {
  black: 'var(--color-icon-surface-black)',
  orange: 'var(--color-icon-surface-orange)',
  grey: 'var(--color-icon-surface-grey)',
};

const BBOX = { x: 0, y: 0, w: 13.333_333_333_333_334, h: 13.333_333_333_333_334 } as const;
/** 13.33 × 13.33 px (40/3) */
const DISPLAY = { w: 40 / 3, h: 40 / 3 } as const;

/**
 * Outer rounded-rect from Figma stop geometry only. The full `fillGeometry` compound
 * path included an inner contour that punched a hole with `fillRule="nonzero"`;
 * this single contour matches the outer frame and renders solid.
 */
const STOP_PATH =
  'M13.3333 11.3333 C13.3333 12.4379 12.4379 13.3333 11.3333 13.3333 L2 13.3333 C0.895431 13.3333 0 12.4379 0 11.3333 L0 2 C0 0.895431 0.895431 0 2 0 L11.3333 0 C12.4379 0 13.3333 0.895431 13.3333 2 L13.3333 11.3333 Z';

export const Stop = React.forwardRef<SVGSVGElement, StopProps>(
  function Stop(
    { color = 'black', size = 16, className, children, ...rest },
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
          <path d={STOP_PATH} fill={FILL_BY_COLOR[color]} />
        </g>
        {children}
      </svg>
    );
  }
);
