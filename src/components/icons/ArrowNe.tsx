import * as React from 'react';
import { iconFitToDisplayRect } from './iconFrame';

/**
 * Arrow pointing north-east — ports Figma component set `icons / Arrow-NE`
 * (variants Color=Black | Orange | Grey). Geometry from Plugin API `fillGeometry`
 * on node `154:89` (Black variant).
 *
 * Fills use mapped tokens (same as Figma variable bindings):
 * - black → --color-icon-surface-black
 * - orange → --color-icon-surface-orange
 * - grey → --color-icon-surface-grey
 */

export type ArrowNeColor = 'black' | 'orange' | 'grey';

export type ArrowNeProps = Omit<
  React.SVGProps<SVGSVGElement>,
  'fill' | 'width' | 'height'
> & {
  color?: ArrowNeColor;
  size?: number;
};

const FILL_BY_COLOR: Record<ArrowNeColor, string> = {
  black: 'var(--color-icon-surface-black)',
  orange: 'var(--color-icon-surface-orange)',
  grey: 'var(--color-icon-surface-grey)',
};

/** Tight bbox around path (path coords); laid out inside 16×16 frame. */
const BBOX = { x: -0.0812963, y: 0, w: 10.0812963, h: 10 } as const;
const DISPLAY = { w: 10, h: 10 } as const;

/** Path `d` from Figma `fillGeometry[0].data` (local path space) */
const ARROW_NE_PATH =
  'M10 9.16667 C10 9.6269 9.6269 10 9.16667 10 C8.70643 10 8.33333 9.6269 8.33333 9.16667 L8.33333 2.84505 L1.42253 9.75586 C1.09709 10.0813 0.569577 10.0813 0.244141 9.75586 C-0.0812963 9.43042 -0.0812963 8.90291 0.244141 8.57747 L7.15495 1.66667 L0.833333 1.66667 C0.373096 1.66667 0 1.29357 0 0.833333 C0 0.373096 0.373096 0 0.833333 0 L9.16667 0 C9.6269 0 10 0.373096 10 0.833333 L10 9.16667 Z';

export const ArrowNe = React.forwardRef<SVGSVGElement, ArrowNeProps>(
  function ArrowNe(
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
          <path d={ARROW_NE_PATH} fill={FILL_BY_COLOR[color]} />
        </g>
        {children}
      </svg>
    );
  }
);
