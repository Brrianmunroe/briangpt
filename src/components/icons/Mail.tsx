import * as React from 'react';
import { iconFitToDisplayRect } from './iconFrame';

/**
 * Mail / envelope icon — ports Figma component set `icons / mail`
 * (variants Color=Black | Orange | Grey). Geometry from Plugin API `fillGeometry`
 * on node `130:98` (Black variant).
 *
 * Fills use mapped tokens (same as Figma variable bindings):
 * - black → --color-icon-surface-black
 * - orange → --color-icon-surface-orange
 * - grey → --color-icon-surface-grey
 */

export type MailColor = 'black' | 'orange' | 'grey';

export type MailProps = Omit<
  React.SVGProps<SVGSVGElement>,
  'fill' | 'width' | 'height'
> & {
  color?: MailColor;
  size?: number;
};

const FILL_BY_COLOR: Record<MailColor, string> = {
  black: 'var(--color-icon-surface-black)',
  orange: 'var(--color-icon-surface-orange)',
  grey: 'var(--color-icon-surface-grey)',
};

const BBOX = { x: 0, y: 0, w: 14.666_666_666_666_666, h: 12 } as const;
/** 14.67 × 12 px */
const DISPLAY = { w: 44 / 3, h: 12 } as const;

/** Path `d` from Figma `fillGeometry[0].data` (NONZERO compound path) */
const MAIL_PATH =
  'M13.3333 3.88151 L8.36393 7.04688 C8.35637 7.05169 8.3489 7.05669 8.34115 7.0612 C8.03611 7.23837 7.68934 7.33134 7.33659 7.33138 C6.98382 7.33138 6.6371 7.23835 6.33203 7.0612 C6.32425 7.05668 6.31619 7.05171 6.30859 7.04688 L1.33333 3.88086 L1.33333 10 C1.33333 10.3682 1.63181 10.6667 2 10.6667 L12.6667 10.6667 C13.0349 10.6667 13.3333 10.3682 13.3333 10 L13.3333 3.88151 Z M13.3333 2 C13.3333 1.63181 13.0349 1.33333 12.6667 1.33333 L2 1.33333 C1.63181 1.33333 1.33333 1.63181 1.33333 2 L1.33333 2.30013 L7.00521 5.91016 C7.10602 5.96787 7.22038 5.99805 7.33659 5.99805 C7.45248 5.998 7.56607 5.9676 7.66667 5.91016 L13.3333 2.30013 L13.3333 2 Z M14.6667 10 C14.6667 11.1046 13.7712 12 12.6667 12 L2 12 C0.89543 12 0 11.1046 0 10 L0 2 C0 0.895431 0.895431 0 2 0 L12.6667 0 C13.7712 0 14.6667 0.895431 14.6667 2 L14.6667 10 Z';

export const Mail = React.forwardRef<SVGSVGElement, MailProps>(
  function Mail(
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
            d={MAIL_PATH}
            fill={FILL_BY_COLOR[color]}
            fillRule="nonzero"
          />
        </g>
        {children}
      </svg>
    );
  }
);
