import * as React from 'react';
import { iconFitToDisplayRect } from './iconFrame';

/**
 * Prompt icon — ports Figma component set `icons / prompt`
 * (variants Color=Black | Orange | Grey). Stroke geometry from design sheet.
 *
 * Strokes use mapped tokens (same as Figma variable bindings):
 * - black → --color-icon-surface-black
 * - orange → --color-icon-surface-orange
 * - grey → --color-icon-surface-grey
 */

export type PromptColor = 'black' | 'orange' | 'grey';

export type PromptProps = Omit<
  React.SVGProps<SVGSVGElement>,
  'fill' | 'stroke' | 'strokeWidth' | 'width' | 'height'
> & {
  color?: PromptColor;
  size?: number;
};

const STROKE_BY_COLOR: Record<PromptColor, string> = {
  black: 'var(--color-icon-surface-black)',
  orange: 'var(--color-icon-surface-orange)',
  grey: 'var(--color-icon-surface-grey)',
};

const BBOX = { x: 22, y: 22, w: 12, h: 12 } as const;
const DISPLAY = { w: 12, h: 12 } as const;

/** Compound path from Figma black variant (stroke icon). */
const PROMPT_PATH =
  'M24.6667 27.3333L26 26L24.6667 24.6667M27.3333 28.6667H30M23.3333 22H32.6667C33.403 22 34 22.597 34 23.3333V32.6667C34 33.403 33.403 34 32.6667 34H23.3333C22.597 34 22 33.403 22 32.6667V23.3333C22 22.597 22.597 22 23.3333 22Z';

export const Prompt = React.forwardRef<SVGSVGElement, PromptProps>(function Prompt(
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
          d={PROMPT_PATH}
          fill="none"
          stroke={STROKE_BY_COLOR[color]}
          strokeWidth={1.33333}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      {children}
    </svg>
  );
});
