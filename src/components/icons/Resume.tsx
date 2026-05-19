import * as React from 'react';
import { iconFitToDisplayRect } from './iconFrame';

/**
 * Resume / file-with-profile icon — ports Figma component set `icons / resume`
 * (variants Color=Black | Orange | Grey). The dashed purple frame from the
 * variant source is intentionally excluded.
 *
 * Strokes use mapped tokens (same as Figma variable bindings):
 * - black → --color-icon-surface-black
 * - orange → --color-icon-surface-orange
 * - grey → --color-icon-surface-grey
 */

export type ResumeColor = 'black' | 'orange' | 'grey';

export type ResumeProps = Omit<
  React.SVGProps<SVGSVGElement>,
  'fill' | 'stroke' | 'width' | 'height'
> & {
  color?: ResumeColor;
  size?: number;
};

const STROKE_BY_COLOR: Record<ResumeColor, string> = {
  black: 'var(--color-icon-surface-black)',
  orange: 'var(--color-icon-surface-orange)',
  grey: 'var(--color-icon-surface-grey)',
};

const BBOX = { x: 22.6667, y: 21.3333, w: 10.6667, h: 13.3333 } as const;
const DISPLAY = { w: 10.6667, h: 13.3333 } as const;

/** Path `d` from Figma node `145:707`, icon `Resume` (black geometry source). */
const RESUME_PATH =
  'M29.3334 21.3333H24C23.6464 21.3333 23.3073 21.4738 23.0572 21.7238C22.8072 21.9739 22.6667 22.313 22.6667 22.6666V33.3333C22.6667 33.6869 22.8072 34.0261 23.0572 34.2761C23.3073 34.5262 23.6464 34.6666 24 34.6666H32C32.3536 34.6666 32.6928 34.5262 32.9428 34.2761C33.1929 34.0261 33.3334 33.6869 33.3334 33.3333V25.3333M29.3334 21.3333C29.5444 21.333 29.7534 21.3744 29.9484 21.4552C30.1433 21.5359 30.3204 21.6545 30.4694 21.804L32.8614 24.196C33.0112 24.345 33.1301 24.5222 33.2111 24.7174C33.2922 24.9126 33.3337 25.122 33.3334 25.3333M29.3334 21.3333L29.3334 24.6666C29.3334 24.8435 29.4036 25.013 29.5286 25.1381C29.6536 25.2631 29.8232 25.3333 30 25.3333L33.3334 25.3333M30.6667 34.6666C30.6667 33.9594 30.3857 33.2811 29.8856 32.781C29.3855 32.2809 28.7073 32 28 32M28 32C27.2928 32 26.6145 32.2809 26.1144 32.781C25.6143 33.2811 25.3334 33.9594 25.3334 34.6666M28 32C29.1046 32 30 31.1046 30 30C30 28.8954 29.1046 28 28 28C26.8955 28 26 28.8954 26 30C26 31.1046 26.8955 32 28 32Z';

export const Resume = React.forwardRef<SVGSVGElement, ResumeProps>(
  function Resume(
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
            d={RESUME_PATH}
            stroke={STROKE_BY_COLOR[color]}
            strokeWidth={4 / 3}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
        {children}
      </svg>
    );
  }
);
