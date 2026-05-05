import * as React from 'react';
import { iconFitToDisplayRect } from './iconFrame';

/**
 * Menu (hamburger) icon — ports Figma component set `icons / menu`
 * (variants Color=Black | Orange | Grey). Geometry from Plugin API `fillGeometry`
 * on node `130:101` (Black variant).
 *
 * Fills use mapped tokens (same as Figma variable bindings):
 * - black → --color-icon-surface-black
 * - orange → --color-icon-surface-orange
 * - grey → --color-icon-surface-grey
 */

export type MenuColor = 'black' | 'orange' | 'grey';

export type MenuProps = Omit<
  React.SVGProps<SVGSVGElement>,
  'fill' | 'width' | 'height'
> & {
  color?: MenuColor;
  size?: number;
};

const FILL_BY_COLOR: Record<MenuColor, string> = {
  black: 'var(--color-icon-surface-black)',
  orange: 'var(--color-icon-surface-orange)',
  grey: 'var(--color-icon-surface-grey)',
};

const BBOX = { x: 0, y: 0, w: 13.333_333_333_333_334, h: 13.333_333_333_333_334 } as const;
/** 13.33 × 13.33 px (40/3) */
const DISPLAY = { w: 40 / 3, h: 40 / 3 } as const;

/** Path `d` from Figma `fillGeometry[0].data` (NONZERO compound path) */
const MENU_PATH =
  'M12 2 C12 1.63181 11.7015 1.33333 11.3333 1.33333 L2 1.33333 C1.63181 1.33333 1.33333 1.63181 1.33333 2 L1.33333 11.3333 C1.33333 11.7015 1.63181 12 2 12 L11.3333 12 C11.7015 12 12 11.7015 12 11.3333 L12 2 Z M10 8.66667 C10.3682 8.66667 10.6667 8.96514 10.6667 9.33333 C10.6667 9.70152 10.3682 10 10 10 L3.33333 10 C2.96514 10 2.66667 9.70152 2.66667 9.33333 C2.66667 8.96514 2.96514 8.66667 3.33333 8.66667 L10 8.66667 Z M10 6 C10.3682 6 10.6667 6.29848 10.6667 6.66667 C10.6667 7.03486 10.3682 7.33333 10 7.33333 L3.33333 7.33333 C2.96514 7.33333 2.66667 7.03486 2.66667 6.66667 C2.66667 6.29848 2.96514 6 3.33333 6 L10 6 Z M10 3.33333 C10.3682 3.33333 10.6667 3.63181 10.6667 4 C10.6667 4.36819 10.3682 4.66667 10 4.66667 L3.33333 4.66667 C2.96514 4.66667 2.66667 4.36819 2.66667 4 C2.66667 3.63181 2.96514 3.33333 3.33333 3.33333 L10 3.33333 Z M13.3333 11.3333 C13.3333 12.4379 12.4379 13.3333 11.3333 13.3333 L2 13.3333 C0.895431 13.3333 0 12.4379 0 11.3333 L0 2 C0 0.89543 0.89543 0 2 0 L11.3333 0 C12.4379 0 13.3333 0.895431 13.3333 2 L13.3333 11.3333 Z';

export const Menu = React.forwardRef<SVGSVGElement, MenuProps>(
  function Menu(
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
            d={MENU_PATH}
            fill={FILL_BY_COLOR[color]}
            fillRule="nonzero"
          />
        </g>
        {children}
      </svg>
    );
  }
);
