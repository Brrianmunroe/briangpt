import * as React from 'react';
import styles from './NameTag.module.css';

const DEFAULT_LABEL = 'Brian Munroe · Product Designer · Building AI with AI';

export type NameTagProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> & {
  /** Badge copy (Figma default is a single line with middle dots). */
  children?: React.ReactNode;
};

export const NameTag = React.forwardRef<HTMLDivElement, NameTagProps>(
  function NameTag({ children = DEFAULT_LABEL, className, ...rest }, ref) {
    const rootClass = [styles.root, className].filter(Boolean).join(' ');

    return (
      <div ref={ref} className={rootClass} {...rest}>
        <div className={styles.indicator} aria-hidden>
          <div className={styles.indicatorGlow}>
            <img
              className={styles.indicatorGlowImg}
              src="/name-tag-indicator-glow.svg"
              alt=""
              width={24}
              height={24}
            />
          </div>
          <div className={styles.indicatorRing}>
            <div className={styles.indicatorCore} />
          </div>
        </div>
        <div className={styles.label}>{children}</div>
      </div>
    );
  }
);
