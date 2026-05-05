import * as React from 'react';
import styles from './ThinkingIndicator.module.css';

export type ThinkingIndicatorProps = {
  className?: string;
  /** Visually hidden label for screen readers. */
  label?: string;
};

/**
 * Compact “assistant is thinking” row — aligns with chatbot message column (Figma conversation frame).
 */
export function ThinkingIndicator({
  className,
  label = 'Assistant is thinking',
}: ThinkingIndicatorProps) {
  return (
    <div className={className} role="status" aria-live="polite" aria-label={label}>
      <div className={styles.root}>
        <span className={styles.dot} />
        <span className={styles.dot} />
        <span className={styles.dot} />
      </div>
    </div>
  );
}
