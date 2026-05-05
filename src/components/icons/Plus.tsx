import * as React from 'react';
import { iconFitToDisplayRect } from './iconFrame';

/**
 * Plus icon — ports Figma component set `icons / plus`
 * (variants Color=Black | Orange | Grey). Geometry from Plugin API `fillGeometry`
 * on node `130:100` (Black variant).
 *
 * Fills use mapped tokens (same as Figma variable bindings):
 * - black → --color-icon-surface-black
 * - orange → --color-icon-surface-orange
 * - grey → --color-icon-surface-grey
 */

export type PlusColor = 'black' | 'orange' | 'grey';

export type PlusProps = Omit<
  React.SVGProps<SVGSVGElement>,
  'fill' | 'width' | 'height'
> & {
  color?: PlusColor;
  size?: number;
};

const FILL_BY_COLOR: Record<PlusColor, string> = {
  black: 'var(--color-icon-surface-black)',
  orange: 'var(--color-icon-surface-orange)',
  grey: 'var(--color-icon-surface-grey)',
};

const BBOX = { x: 0, y: 0, w: 10.666_666_666_666_668, h: 10.666_666_666_666_668 } as const;
/** 10.67 × 10.67 px (32/3) */
const DISPLAY = { w: 32 / 3, h: 32 / 3 } as const;

/** Path `d` from Figma `fillGeometry[0].data` (local path space) */
const PLUS_PATH =
  'M4.66667 10 L4.66667 6 L0.666667 6 C0.298477 6 0 5.70152 0 5.33333 C0 4.96514 0.298477 4.66667 0.666667 4.66667 L4.66667 4.66667 L4.66667 0.666667 C4.66667 0.298477 4.96514 0 5.33333 0 C5.70152 0 6 0.298477 6 0.666667 L6 4.66667 L10 4.66667 C10.3682 4.66667 10.6667 4.96514 10.6667 5.33333 C10.6667 5.70152 10.3682 6 10 6 L6 6 L6 10 C6 10.3682 5.70152 10.6667 5.33333 10.6667 C4.96514 10.6667 4.66667 10.3682 4.66667 10 Z';

export const Plus = React.forwardRef<SVGSVGElement, PlusProps>(
  function Plus(
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
          <path d={PLUS_PATH} fill={FILL_BY_COLOR[color]} />
        </g>
        {children}
      </svg>
    );
  }
);
