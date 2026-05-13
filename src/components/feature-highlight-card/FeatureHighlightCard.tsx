import styles from './FeatureHighlightCard.module.css';

export type FeatureHighlightCardCorner = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export type FeatureHighlightCardProps = {
  corner: FeatureHighlightCardCorner;
  title: string;
  body: string;
  mediaSrc?: string;
  mediaAlt?: string;
  className?: string;
};

export function FeatureHighlightCard({
  corner,
  title,
  body,
  mediaSrc,
  mediaAlt = '',
  className,
}: FeatureHighlightCardProps) {
  const rootClass = [styles.root, className].filter(Boolean).join(' ');

  return (
    <article className={rootClass} data-corner={corner}>
      {mediaSrc ? (
        <div className={styles.media}>
          <img className={styles.mediaImg} src={mediaSrc} alt={mediaAlt} />
        </div>
      ) : null}
      <div className={styles.titleRow}>
        <p className={styles.title}>{title}</p>
      </div>
      <p className={styles.body}>{body}</p>
    </article>
  );
}
