import * as React from 'react';
import { iconFitToDisplayRect } from './iconFrame';

/**
 * Globe icon — ports Figma component set `icons / globe`
 * (variants Color=Black | Orange | Grey). Geometry from Plugin API `fillGeometry`
 * on node `130:97` (Black variant).
 *
 * Fills use mapped tokens (same as Figma variable bindings):
 * - black → --color-icon-surface-black
 * - orange → --color-icon-surface-orange
 * - grey → --color-icon-surface-grey
 */

export type GlobeColor = 'black' | 'orange' | 'grey';

export type GlobeProps = Omit<
  React.SVGProps<SVGSVGElement>,
  'fill' | 'width' | 'height'
> & {
  color?: GlobeColor;
  size?: number;
};

const FILL_BY_COLOR: Record<GlobeColor, string> = {
  black: 'var(--color-icon-surface-black)',
  orange: 'var(--color-icon-surface-orange)',
  grey: 'var(--color-icon-surface-grey)',
};

const BBOX = { x: 0, y: 0, w: 14.666_666_666_666_666, h: 14.666_666_666_666_666 } as const;
/** 14.67 × 14.67 px (44/3) */
const DISPLAY = { w: 44 / 3, h: 44 / 3 } as const;

/** Path `d` from Figma `fillGeometry[0].data` (NONZERO compound path) */
const GLOBE_PATH =
  'M7.33333 0 C11.3834 0 14.6667 3.28325 14.6667 7.33333 C14.6667 11.3834 11.3834 14.6667 7.33333 14.6667 C3.28325 14.6667 0 11.3834 0 7.33333 C0 3.28325 3.28325 0 7.33333 0 Z M1.37109 8 C1.64499 10.4773 3.42631 12.4987 5.778 13.1283 C4.7502 11.6109 4.14111 9.84119 4.02214 8 L1.37109 8 Z M10.6445 8 C10.5255 9.84132 9.91594 11.6108 8.88802 13.1283 C11.24 12.4988 13.0217 10.4775 13.2956 8 L10.6445 8 Z M5.35807 8 C5.49361 9.82549 6.18354 11.5659 7.33333 12.9889 C8.48313 11.5659 9.17306 9.82549 9.30859 8 L5.35807 8 Z M8.88802 1.53776 C9.91613 3.05533 10.5255 4.82517 10.6445 6.66667 L13.2956 6.66667 C13.0216 4.18914 11.2401 2.16713 8.88802 1.53776 Z M7.33333 1.67708 C6.18335 3.10018 5.49362 4.84101 5.35807 6.66667 L9.30859 6.66667 C9.17305 4.84101 8.48332 3.10018 7.33333 1.67708 Z M5.778 1.53776 C3.42622 2.16731 1.645 4.18935 1.37109 6.66667 L4.02214 6.66667 C4.14113 4.82529 4.75001 3.05526 5.778 1.53776 Z';

export const Globe = React.forwardRef<SVGSVGElement, GlobeProps>(
  function Globe(
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
          <path
            d={GLOBE_PATH}
            fill={FILL_BY_COLOR[color]}
            fillRule="nonzero"
          />
        </g>
        {children}
      </svg>
    );
  }
);
