import * as React from 'react';
import { ArrowNe } from '@/components/icons';
import styles from './Card.module.css';

/** Figma `Type=Primary` | `Type=Secondary` on component set `card` */
export type CardVariant = 'primary' | 'secondary';

export type CardProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> & {
  variant?: CardVariant;
  /** First line (Figma: “Card Title”) */
  title: React.ReactNode;
  /** Second line (Figma: “Card Subtitle”) */
  subtitle: React.ReactNode;
  /** Leading corner icon (Figma: Arrow NE) */
  showIcon?: boolean;
  icon?: React.ReactNode;
  /** Non-interactive disabled visuals + `aria-disabled` */
  disabled?: boolean;
};

const variantClass: Record<CardVariant, string> = {
  primary: styles.primary,
  secondary: styles.secondary,
};

function mergeClassNames(...parts: Array<string | undefined>) {
  return parts.filter(Boolean).join(' ');
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(function Card(
  {
    variant = 'primary',
    title,
    subtitle,
    showIcon = true,
    icon,
    className,
    disabled,
    ...rest
  },
  ref
) {
  const rootClass = mergeClassNames(styles.root, variantClass[variant], className);
  const arrowColor =
    variant === 'primary'
      ? disabled
        ? 'grey'
        : 'black'
      : disabled
        ? 'grey'
        : 'orange';

  return (
    <div
      ref={ref}
      className={rootClass}
      data-variant={variant}
      aria-disabled={disabled || undefined}
      {...rest}
    >
      <div className={styles.topRow}>
        {showIcon &&
          (icon ?? <ArrowNe color={arrowColor} size={16} aria-hidden />)}
      </div>
      <div className={styles.body}>
        <p className={styles.title}>{title}</p>
        <p className={styles.subtitle}>{subtitle}</p>
      </div>
    </div>
  );
});
