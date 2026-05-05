import * as React from 'react';
import { UpArrow } from '@/components/icons';
import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';

export type ButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'type' | 'children'
> & {
  /** Figma `Type` — primary | secondary | ghost */
  variant?: ButtonVariant;
  /** Button label; omit when `iconOnly` (use `aria-label` on the button). */
  children?: React.ReactNode;
  /** Icon only: 32×32 circle, no label; always shows the icon (or `icon`). */
  iconOnly?: boolean;
  /** Matches Figma instance: show leading arrow icon (ignored when `iconOnly`). */
  showIcon?: boolean;
  /** Replace default up-arrow icon */
  icon?: React.ReactNode;
  /** Native `type` (not visual variant) */
  buttonType?: 'button' | 'submit' | 'reset';
};

const variantClass: Record<ButtonVariant, string> = {
  primary: styles.primary,
  secondary: styles.secondary,
  ghost: styles.ghost,
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = 'primary',
      children,
      iconOnly = false,
      showIcon = true,
      icon,
      className,
      buttonType = 'button',
      disabled,
      ...rest
    },
    ref
  ) {
    const showIconResolved = iconOnly ? true : showIcon;
    const rootClass = [
      styles.root,
      variantClass[variant],
      iconOnly ? styles.iconOnly : null,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        ref={ref}
        type={buttonType}
        className={rootClass}
        disabled={disabled}
        {...rest}
      >
        {showIconResolved ? (
          <span className={styles.icon} aria-hidden>
            {icon ?? (
              <UpArrow
                aria-hidden
                size={16}
                fill="var(--button-icon-fill)"
              />
            )}
          </span>
        ) : null}
        {!iconOnly && children != null ? (
          <span className={styles.label}>{children}</span>
        ) : null}
      </button>
    );
  }
);
