import * as React from 'react';
import { Globe } from '@/components/icons';
import styles from './PromptChip.module.css';

export type PromptChipPreviewState =
  | 'default'
  | 'hover'
  | 'pressed'
  | 'disabled'
  | 'focused';

export type PromptChipProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'type' | 'children'
> & {
  /** Chip label (Figma default: “prompt chip”) */
  children: React.ReactNode;
  /** Leading globe icon (Figma default: on) */
  showIcon?: boolean;
  /** Replace default globe icon */
  icon?: React.ReactNode;
  /** Static Figma state for docs or previews (non-interactive). */
  previewState?: PromptChipPreviewState;
  buttonType?: 'button' | 'submit' | 'reset';
};

function mergeClassNames(...parts: Array<string | undefined>) {
  return parts.filter(Boolean).join(' ');
}

function previewForceClass(state: PromptChipPreviewState | undefined) {
  if (!state || state === 'default') return '';
  switch (state) {
    case 'hover':
      return styles.forceHover;
    case 'pressed':
      return styles.forcePressed;
    case 'focused':
      return styles.forceFocused;
    case 'disabled':
      return styles.forceDisabled;
    default:
      return '';
  }
}

export const PromptChip = React.forwardRef<HTMLButtonElement, PromptChipProps>(
  function PromptChip(
    {
      children,
      showIcon = true,
      icon,
      className,
      disabled,
      previewState,
      buttonType = 'button',
      ...rest
    },
    ref
  ) {
    const rootClass = mergeClassNames(styles.root, previewForceClass(previewState), className);
    const iconColor = disabled || previewState === 'disabled' ? 'grey' : 'orange';

    const inner = (
      <>
        {showIcon && (
          <span className={styles.icon}>
            {icon ?? <Globe color={iconColor} size={16} aria-hidden />}
          </span>
        )}
        <span className={styles.label}>{children}</span>
      </>
    );

    if (previewState) {
      return (
        <div
          className={mergeClassNames(rootClass, styles.staticPreview)}
          role="group"
          aria-label={`Prompt chip preview (${previewState})`}
          aria-hidden
        >
          {inner}
        </div>
      );
    }

    return (
      <button
        ref={ref}
        type={buttonType}
        className={rootClass}
        disabled={disabled}
        {...rest}
      >
        {inner}
      </button>
    );
  }
);
