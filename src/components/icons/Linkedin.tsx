import * as React from 'react';
import { iconFitToDisplayRect } from './iconFrame';

/**
 * LinkedIn mark — ports Figma component set `icons / linkedin`
 * (variants color=black | orange | Grey). Geometry from Plugin API `fillGeometry`
 * on node `144:463` (black variant).
 *
 * Fills use mapped tokens (same as Figma variable bindings):
 * - black → --color-icon-surface-black
 * - orange → --color-icon-surface-orange
 * - grey → --color-icon-surface-grey
 */

export type LinkedinColor = 'black' | 'orange' | 'grey';

export type LinkedinProps = Omit<
  React.SVGProps<SVGSVGElement>,
  'fill' | 'width' | 'height'
> & {
  color?: LinkedinColor;
  size?: number;
};

const FILL_BY_COLOR: Record<LinkedinColor, string> = {
  black: 'var(--color-icon-surface-black)',
  orange: 'var(--color-icon-surface-orange)',
  grey: 'var(--color-icon-surface-grey)',
};

const BBOX = { x: 0, y: 0, w: 14.333, h: 13.667 } as const;
const DISPLAY = { w: 14.33, h: 13.67 } as const;

/** Path `d` from Figma `fillGeometry[0].data` (NONZERO compound path) */
const LINKEDIN_PATH =
  'M3.16699 4.66699 C3.44298 4.66717 3.66699 4.89096 3.66699 5.16699 L3.66699 13.167 C3.66682 13.4429 3.44288 13.6668 3.16699 13.667 L0.5 13.667 C0.223966 13.667 0.000176185 13.443 0 13.167 L0 5.16699 C0 4.89085 0.223858 4.66699 0.5 4.66699 L3.16699 4.66699 Z M13.333 8.5 C13.333 7.5719 12.9648 6.68174 12.3086 6.02539 C11.6522 5.36901 10.7613 5 9.83301 5 C8.90487 5.00009 8.0147 5.36909 7.3584 6.02539 C6.70212 6.68175 6.33301 7.57182 6.33301 8.5 L6.33301 12.667 L8 12.667 L8 8.5 C8 8.01385 8.1934 7.5479 8.53711 7.2041 C8.88085 6.86036 9.3469 6.66708 9.83301 6.66699 C10.3192 6.66699 10.7861 6.86029 11.1299 7.2041 C11.4735 7.54789 11.667 8.01392 11.667 8.5 L11.667 12.667 L13.333 12.667 L13.333 8.5 Z M1 12.667 L2.66699 12.667 L2.66699 5.66699 L1 5.66699 L1 12.667 Z M2.66699 1.83301 C2.66682 1.37292 2.29314 1 1.83301 1 C1.37303 1.00018 1.00018 1.37303 1 1.83301 C1 2.29314 1.37292 2.66682 1.83301 2.66699 C2.29325 2.66699 2.66699 2.29325 2.66699 1.83301 Z M14.333 13.167 C14.3328 13.443 14.109 13.667 13.833 13.667 L11.167 13.667 C10.891 13.667 10.6672 13.443 10.667 13.167 L10.667 8.5 C10.667 8.27914 10.5789 8.06738 10.4229 7.91113 C10.2666 7.75485 10.054 7.66699 9.83301 7.66699 C9.61211 7.66708 9.40034 7.75493 9.24414 7.91113 C9.08796 8.0674 9 8.27906 9 8.5 L9 13.167 C8.99982 13.443 8.77603 13.667 8.5 13.667 L5.83301 13.667 C5.55712 13.6668 5.33318 13.4429 5.33301 13.167 L5.33301 8.5 C5.33301 7.3066 5.80756 6.16226 6.65137 5.31836 C7.4952 4.47452 8.63965 4.00009 9.83301 4 C11.0265 4 12.1717 4.47445 13.0156 5.31836 C13.8593 6.16224 14.333 7.30668 14.333 8.5 L14.333 13.167 Z M3.66699 1.83301 C3.66699 2.84553 2.84553 3.66699 1.83301 3.66699 C0.820635 3.66682 0 2.84542 0 1.83301 C0.00017584 0.820744 0.820744 0.00017584 1.83301 0 C2.84542 0 3.66682 0.820635 3.66699 1.83301 Z';

export const Linkedin = React.forwardRef<SVGSVGElement, LinkedinProps>(
  function Linkedin(
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
            d={LINKEDIN_PATH}
            fill={FILL_BY_COLOR[color]}
            fillRule="nonzero"
          />
        </g>
        {children}
      </svg>
    );
  }
);
