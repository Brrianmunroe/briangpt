import styles from './FeatureHighlightCardIndicator.module.css';

export type FeatureHighlightCardIndicatorProps = {
  className?: string;
  /** Exposed for screen-reader context when used as a control */
  label?: string;
};

/** Small circular hotspot from Figma Frame 180 — expands into FeatureHighlightCard in the hero flow. */
export function FeatureHighlightCardIndicator({ className, label }: FeatureHighlightCardIndicatorProps) {
  const rootClass = [styles.root, className].filter(Boolean).join(' ');

  if (label) {
    return (
      <div className={rootClass} role="img" aria-label={label}>
        <div className={styles.core} aria-hidden />
      </div>
    );
  }

  return (
    <div className={rootClass} aria-hidden>
      <div className={styles.core} aria-hidden />
    </div>
  );
}
