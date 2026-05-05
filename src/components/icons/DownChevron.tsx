import * as React from 'react';
import { iconFitToDisplayRect } from './iconFrame';

/**
 * Down chevron icon — ports Figma component set `icons / down-chevron`
 * (variants Color=Black | Orange | Grey). Geometry from Plugin API `fillGeometry`
 * on node `130:99` (Black variant).
 *
 * Fills use mapped tokens (same as Figma variable bindings):
 * - black → --color-icon-surface-black
 * - orange → --color-icon-surface-orange
 * - grey → --color-icon-surface-grey
 */

export type DownChevronColor = 'black' | 'orange' | 'grey';

export type DownChevronProps = Omit<
  React.SVGProps<SVGSVGElement>,
  'fill' | 'width' | 'height'
> & {
  color?: DownChevronColor;
  size?: number;
};

const FILL_BY_COLOR: Record<DownChevronColor, string> = {
  black: 'var(--color-icon-surface-black)',
  orange: 'var(--color-icon-surface-orange)',
  grey: 'var(--color-icon-surface-grey)',
};

const BBOX = { x: 0.195262, y: -0.0650874, w: 8.942708, h: 5.4634074 } as const;
/** 9.33 × 5.33 px (28/3 × 16/3) */
const DISPLAY = { w: 28 / 3, h: 16 / 3 } as const;

/** Path `d` from Figma `fillGeometry[0].data` (local path space) */
const DOWN_CHEVRON_PATH =
  'M8.19526 0.195262 C8.45561 -0.0650874 8.87762 -0.0650874 9.13797 0.195262 C9.39832 0.455612 9.39832 0.877621 9.13797 1.13797 L5.13797 5.13797 C4.87762 5.39832 4.45561 5.39832 4.19526 5.13797 L0.195262 1.13797 C-0.0650874 0.877621 -0.0650874 0.455612 0.195262 0.195262 C0.455612 -0.0650874 0.877621 -0.0650874 1.13797 0.195262 L4.66662 3.72391 L8.19526 0.195262 Z';

export const DownChevron = React.forwardRef<SVGSVGElement, DownChevronProps>(
  function DownChevron(
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
          <path d={DOWN_CHEVRON_PATH} fill={FILL_BY_COLOR[color]} />
        </g>
        {children}
      </svg>
    );
  }
);
