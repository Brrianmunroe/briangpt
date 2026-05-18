import * as React from 'react';

export type CloseColor = 'black' | 'orange' | 'grey';

export type CloseProps = Omit<
  React.SVGProps<SVGSVGElement>,
  'fill' | 'width' | 'height'
> & {
  color?: CloseColor;
  size?: number;
};

const FILL_BY_COLOR: Record<CloseColor, string> = {
  black: 'var(--color-icon-surface-black)',
  orange: 'var(--color-icon-surface-orange)',
  grey: 'var(--color-icon-surface-grey)',
};

/**
 * Close (X) icon used by the mobile drawer close control.
 */
export const Close = React.forwardRef<SVGSVGElement, CloseProps>(
  function Close({ color = 'grey', size = 16, className, children, ...rest }, ref) {
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
        <path
          d="M3.293 2.293a1 1 0 0 1 1.414 0L8 5.586l3.293-3.293a1 1 0 1 1 1.414 1.414L9.414 7l3.293 3.293a1 1 0 0 1-1.414 1.414L8 8.414l-3.293 3.293a1 1 0 0 1-1.414-1.414L6.586 7 3.293 3.707a1 1 0 0 1 0-1.414Z"
          fill={FILL_BY_COLOR[color]}
        />
        {children}
      </svg>
    );
  }
);
