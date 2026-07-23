import * as React from 'react';
import Link from 'next/link';
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

type ButtonVisualProps = {
  variant?: ButtonVariant;
  children?: React.ReactNode;
  showIcon?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'start' | 'end';
};

function buttonClassName(variant: ButtonVariant, className?: string) {
  return [styles.root, variantClass[variant], className].filter(Boolean).join(' ');
}

function ButtonContent({
  children,
  showIcon = true,
  icon,
  iconPosition = 'start',
}: Omit<ButtonVisualProps, 'variant'>) {
  const iconElement = showIcon ? (
    <span className={styles.icon} aria-hidden>
      {icon ?? <UpArrow aria-hidden size={16} fill="var(--button-icon-fill)" />}
    </span>
  ) : null;

  return (
    <>
      {iconPosition === 'start' ? iconElement : null}
      {children != null ? <span className={styles.label}>{children}</span> : null}
      {iconPosition === 'end' ? iconElement : null}
    </>
  );
}

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
    const rootClass = [buttonClassName(variant), iconOnly ? styles.iconOnly : null, className]
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

export type ButtonLinkProps = Omit<React.ComponentProps<typeof Link>, 'children'> &
  ButtonVisualProps;

/** Link counterpart to `Button`; shares the same visual variants and states. */
export const ButtonLink = React.forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  function ButtonLink(
    {
      variant = 'primary',
      children,
      showIcon = true,
      icon,
      iconPosition = 'start',
      className,
      ...rest
    },
    ref
  ) {
    return (
      <Link ref={ref} className={buttonClassName(variant, className)} {...rest}>
        <ButtonContent showIcon={showIcon} icon={icon} iconPosition={iconPosition}>
          {children}
        </ButtonContent>
      </Link>
    );
  }
);
