import * as React from 'react';
import styles from './SpeechBubble.module.css';

/** Figma `Type` on component set `speech-bubble` */
export type SpeechBubbleVariant = 'user' | 'chatbot';

export type SpeechBubbleProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> & {
  /** Figma `Type=User` | `Type=Chatbot` */
  variant?: SpeechBubbleVariant;
  children: React.ReactNode;
  /**
   * When true, matches Figma `whitespace-nowrap` on short labels.
   * Default allows wrapping for longer messages.
   */
  nowrap?: boolean;
  /** Chatbot copy spans the full thread width (conversation layout). */
  wide?: boolean;
};

const variantClass: Record<SpeechBubbleVariant, string> = {
  user: styles.user,
  chatbot: styles.chatbot,
};

function mergeClassNames(...parts: Array<string | undefined>) {
  return parts.filter(Boolean).join(' ');
}

export const SpeechBubble = React.forwardRef<HTMLDivElement, SpeechBubbleProps>(
  function SpeechBubble(
    { variant = 'user', children, className, nowrap = false, wide = false, ...rest },
    ref
  ) {
    const rootClass = mergeClassNames(styles.root, variantClass[variant], className);
    const contentClass = mergeClassNames(
      styles.content,
      nowrap ? styles.nowrap : undefined,
      variant === 'chatbot' && wide ? styles.wide : undefined
    );

    return (
      <div ref={ref} className={rootClass} data-variant={variant} {...rest}>
        <div className={contentClass}>{children}</div>
      </div>
    );
  }
);
