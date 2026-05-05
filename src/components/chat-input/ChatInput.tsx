'use client';

import * as React from 'react';
import { Stop, UpArrow } from '@/components/icons';
import styles from './ChatInput.module.css';

const DEFAULT_PLACEHOLDER = 'Ask about ...';
const DEFAULT_FOLLOW_UP_PLACEHOLDER = 'Ask a follow up';
const DEFAULT_ROTATING_PLACEHOLDER_PREFIX = 'Ask me about ... ';
const TYPING_PREVIEW_TEXT = 'The user has started typing';

const TYPE_MS = 48;
const HOLD_AFTER_FULL_MS = 1000;
const DELETE_MS = 32;
const PAUSE_BETWEEN_PROMPTS_MS = 450;

function useRotatingTypewriterSuffix(prompts: readonly string[], enabled: boolean): string {
  const [suffix, setSuffix] = React.useState('');
  const promptsKey = JSON.stringify(prompts);

  React.useEffect(() => {
    if (!enabled || prompts.length === 0) {
      setSuffix('');
      return;
    }

    const list = JSON.parse(promptsKey) as string[];
    let cancelled = false;
    let promptIndex = 0;
    let timeoutId: ReturnType<typeof setTimeout>;

    const runPrompt = () => {
      if (cancelled) return;
      const prompt = (list[promptIndex % list.length] ?? '').toLowerCase();

      const typeStep = (i: number) => {
        if (cancelled) return;
        if (i < prompt.length) {
          setSuffix(prompt.slice(0, i + 1));
          timeoutId = setTimeout(() => typeStep(i + 1), TYPE_MS);
          return;
        }
        timeoutId = setTimeout(deleteStep, HOLD_AFTER_FULL_MS, prompt.length);
      };

      const deleteStep = (remaining: number) => {
        if (cancelled) return;
        const next = remaining - 1;
        if (next >= 0) {
          setSuffix(prompt.slice(0, next));
          timeoutId = setTimeout(() => deleteStep(next), DELETE_MS);
        } else {
          setSuffix('');
          promptIndex = (promptIndex + 1) % list.length;
          timeoutId = setTimeout(runPrompt, PAUSE_BETWEEN_PROMPTS_MS);
        }
      };

      typeStep(0);
    };

    runPrompt();

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [enabled, promptsKey]);

  return suffix;
}

export type ChatInputPreviewState =
  | 'default'
  | 'active'
  | 'typing'
  | 'sent'
  | 'followUp';

export type ChatInputProps = Omit<
  React.FormHTMLAttributes<HTMLFormElement>,
  'onSubmit' | 'children' | 'onChange'
> & {
  value?: string;
  defaultValue?: string;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  /** Called with trimmed value when user submits (Enter without Shift, or send). */
  onSubmit?: (trimmedValue: string) => void;
  /** While true (request in flight: submitted or streaming upstream), the trailing control shows Stop and calls this instead of submit. */
  onStop?: () => void;
  placeholder?: string;
  /** Shown before each rotating suggestion; default ends with `... ` then the typed suffix (lowercase). */
  rotatingPlaceholderPrefix?: string;
  /** When set (non-empty) and the field is empty (not streaming), a typewriter cycles these strings after the prefix instead of a static placeholder. */
  rotatingPlaceholderPrompts?: readonly string[];
  followUpPlaceholder?: string;
  streaming?: boolean;
  /** Layout/placeholder emphasis for the follow-up composer; border states follow focus/value like the default composer. */
  followUpEmphasis?: boolean;
  disabled?: boolean;
  /** Locks layout to a Figma `chat-input` variant (static previews / docs only). */
  previewState?: ChatInputPreviewState;
  /** When `full`, composer uses the full width of its parent (Figma home `334:463`). */
  maxWidth?: 'standard' | 'full';
  /** `page-bottom`: fixed to viewport bottom (composer). Ignored when `previewState` is set. */
  dock?: 'inline' | 'page-bottom';
  /**
   * `inline` — textarea and send/stop on one row (Figma home composer ~750×48).
   * `stacked` — textarea above the trailing control (default).
   */
  layout?: 'stacked' | 'inline';
  /** Passed to the `<textarea>` (except `value` / `defaultValue` / `onChange` / `disabled` / `placeholder`). `ref` is merged with the internal ref. */
  textareaProps?: Omit<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    'value' | 'defaultValue' | 'onChange' | 'disabled' | 'placeholder' | 'readOnly'
  >;
};

function mergeClassNames(...parts: Array<string | undefined | null | false>) {
  return parts.filter(Boolean).join(' ');
}

type NavigationInput = 'pointer' | 'keyboard';

export const ChatInput = React.forwardRef<HTMLFormElement, ChatInputProps>(
  function ChatInput(
    {
      className,
      id,
      value: valueProp,
      defaultValue = '',
      onChange,
      onSubmit,
      onStop,
      placeholder = DEFAULT_PLACEHOLDER,
      rotatingPlaceholderPrefix = DEFAULT_ROTATING_PLACEHOLDER_PREFIX,
      rotatingPlaceholderPrompts,
      followUpPlaceholder = DEFAULT_FOLLOW_UP_PLACEHOLDER,
      streaming = false,
      followUpEmphasis = false,
      disabled = false,
      previewState,
      maxWidth = 'standard',
      dock = 'inline',
      layout = 'stacked',
      textareaProps,
      ...formRest
    }: ChatInputProps,
    ref
  ) {
    const generatedId = React.useId();
    const fieldId = id ?? `chat-input-${generatedId}`;
    const formRef = React.useRef<HTMLFormElement>(null);
    const isControlled = valueProp !== undefined;
    const [uncontrolled, setUncontrolled] = React.useState(defaultValue);
    const value = isControlled ? String(valueProp ?? '') : uncontrolled;
    const [navigationInput, setNavigationInput] = React.useState<NavigationInput>('pointer');
    const [textareaFocused, setTextareaFocused] = React.useState(false);
    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);
    const { ref: textareaRefProp, ...restTextareaProps } = (textareaProps ??
      {}) as Partial<React.ComponentPropsWithRef<'textarea'>>;

    const syncTextareaHeight = React.useCallback(() => {
      const el = textareaRef.current;
      if (!el || previewState) return;
      const maxPx = Math.round(window.innerHeight * 0.5);
      el.style.height = 'auto';
      el.style.height = `${Math.min(el.scrollHeight, maxPx)}px`;
    }, [previewState]);

    React.useLayoutEffect(() => {
      syncTextareaHeight();
    }, [value, streaming, disabled, syncTextareaHeight]);

    React.useEffect(() => {
      const onResize = () => syncTextareaHeight();
      window.addEventListener('resize', onResize);
      return () => window.removeEventListener('resize', onResize);
    }, [syncTextareaHeight]);

    React.useEffect(() => {
      const onPointerDownCapture = () => {
        setNavigationInput((prev) => (prev === 'pointer' ? prev : 'pointer'));
      };
      const onKeyDownCapture = (ev: KeyboardEvent) => {
        if (ev.key !== 'Tab') return;
        setNavigationInput((prev) => (prev === 'keyboard' ? prev : 'keyboard'));
      };
      window.addEventListener('pointerdown', onPointerDownCapture, true);
      window.addEventListener('keydown', onKeyDownCapture, true);
      return () => {
        window.removeEventListener('pointerdown', onPointerDownCapture, true);
        window.removeEventListener('keydown', onKeyDownCapture, true);
      };
    }, []);

    const setTextareaRef = React.useCallback(
      (node: HTMLTextAreaElement | null) => {
        textareaRef.current = node;
        if (typeof textareaRefProp === 'function') {
          textareaRefProp(node);
        } else if (textareaRefProp) {
          (textareaRefProp as React.MutableRefObject<HTMLTextAreaElement | null>).current = node;
        }
      },
      [textareaRefProp]
    );

    const setFormRef = React.useCallback(
      (node: HTMLFormElement | null) => {
        formRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLFormElement | null>).current = node;
        }
      },
      [ref]
    );

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (!isControlled) {
        setUncontrolled(e.target.value);
      }
      onChange?.(e);
    };

    const hasValue = value.trim().length > 0;
    const sendEnabled = hasValue && !streaming && !disabled;

    /** Tab-only shell chrome: outline ring, not used for pointer focus. Drops to active once there is text. */
    const tabFocusChrome =
      textareaFocused && navigationInput === 'keyboard' && !hasValue;

    const rotatingPromptList = rotatingPlaceholderPrompts ?? [];
    const rotatingEligible =
      rotatingPromptList.length > 0 && !previewState && !streaming && !disabled;
    const showAnimatedPlaceholder = rotatingEligible && !hasValue;

    const animatedSuffix = useRotatingTypewriterSuffix(rotatingPromptList, showAnimatedPlaceholder);

    const placeholderText = streaming
      ? followUpPlaceholder
      : showAnimatedPlaceholder
        ? ''
        : placeholder;

    let borderClass = styles.borderDefault;
    if (!previewState) {
      if (streaming) {
        borderClass = styles.borderDefault;
      } else if (tabFocusChrome) {
        borderClass = styles.borderFocused;
      } else if (textareaFocused || hasValue) {
        borderClass = styles.borderActive;
      } else {
        borderClass = styles.borderDefault;
      }
    } else if (previewState === 'default' || previewState === 'sent') {
      borderClass = styles.borderDefault;
    } else if (previewState === 'followUp') {
      borderClass = styles.borderActive;
    } else {
      borderClass = styles.borderActive;
    }

    const rootClass = mergeClassNames(
      styles.root,
      maxWidth === 'full' ? styles.rootFullWidth : undefined,
      borderClass,
      !previewState && layout === 'inline' ? styles.rootInline : undefined,
      !previewState && dock === 'page-bottom' ? styles.rootDockPageBottom : undefined,
      className
    );

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (disabled || previewState) return;
      if (streaming) {
        return;
      }
      if (hasValue) {
        onSubmit?.(value.trim());
      }
    };

    const handleSendClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      if (disabled || previewState) return;
      if (streaming) {
        onStop?.();
        return;
      }
      if (hasValue) {
        onSubmit?.(value.trim());
      }
    };

    const sendClass = mergeClassNames(
      styles.send,
      sendEnabled && !previewState ? styles.sendEnabled : styles.sendDisabled
    );

    if (previewState === 'default') {
      return (
        <div
          className={rootClass}
          role="group"
          aria-label="Chat input (default state preview)"
        >
          <div className={styles.fieldRow}>
            <p className={styles.previewPlaceholder}>{placeholder}</p>
          </div>
          <div className={styles.footer}>
            <button type="button" className={sendClass} disabled tabIndex={-1} aria-hidden>
              <UpArrow color="black" size={16} aria-hidden />
            </button>
          </div>
        </div>
      );
    }

    if (previewState === 'active') {
      return (
        <div
          className={rootClass}
          role="group"
          aria-label="Chat input (active / caret preview)"
        >
          <div className={styles.fieldRow}>
            <p className={styles.previewCaret}>|</p>
          </div>
          <div className={styles.footer}>
            <button type="button" className={sendClass} disabled tabIndex={-1} aria-hidden>
              <UpArrow color="black" size={16} aria-hidden />
            </button>
          </div>
        </div>
      );
    }

    if (previewState === 'typing') {
      return (
        <div className={rootClass} role="group" aria-label="Chat input (typing preview)">
          <div className={styles.fieldRow}>
            <p className={styles.typingLine}>
              <span className={styles.typingText}>{TYPING_PREVIEW_TEXT}</span>
              <span className={styles.typingCaret}>|</span>
            </p>
          </div>
          <div className={styles.footer}>
            <button type="button" className={mergeClassNames(styles.send, styles.sendEnabled)} disabled tabIndex={-1} aria-hidden>
              <UpArrow color="black" size={16} aria-hidden />
            </button>
          </div>
        </div>
      );
    }

    if (previewState === 'sent') {
      return (
        <div className={rootClass} role="group" aria-label="Chat input (sent / stop preview)">
          <div className={styles.fieldRow}>
            <p className={styles.previewPlaceholder}>{followUpPlaceholder}</p>
          </div>
          <div className={styles.footer}>
            <button type="button" className={mergeClassNames(styles.send, styles.sendEnabled)} disabled tabIndex={-1} aria-hidden>
              <Stop color="black" size={16} aria-hidden />
            </button>
          </div>
        </div>
      );
    }

    if (previewState === 'followUp') {
      return (
        <div className={rootClass} role="group" aria-label="Chat input (follow-up emphasis preview)">
          <div className={styles.fieldRow}>
            <p className={styles.previewPlaceholder}>{followUpPlaceholder}</p>
          </div>
          <div className={styles.footer}>
            <button type="button" className={sendClass} disabled tabIndex={-1} aria-hidden>
              <UpArrow color="black" size={16} aria-hidden />
            </button>
          </div>
        </div>
      );
    }

    const { onFocus: onFormFocus, onBlur: onFormBlur, ...formAttrs } = formRest;

    const handleTextareaFocus = React.useCallback(
      (e: React.FocusEvent<HTMLTextAreaElement>) => {
        setTextareaFocused(true);
        restTextareaProps.onFocus?.(e);
        onFormFocus?.(e as unknown as React.FocusEvent<HTMLFormElement>);
      },
      [onFormFocus, restTextareaProps]
    );

    const handleTextareaBlur = React.useCallback(
      (e: React.FocusEvent<HTMLTextAreaElement>) => {
        setTextareaFocused(false);
        const next = e.relatedTarget as Node | null;
        if (next && formRef.current?.contains(next)) {
          restTextareaProps.onBlur?.(e);
          return;
        }
        restTextareaProps.onBlur?.(e);
        onFormBlur?.(e as unknown as React.FocusEvent<HTMLFormElement>);
      },
      [onFormBlur, restTextareaProps]
    );

    const handleTextareaKeyDown = React.useCallback(
      (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey && sendEnabled) {
          e.preventDefault();
          onSubmit?.(value.trim());
        }
        restTextareaProps.onKeyDown?.(e);
      },
      [onSubmit, restTextareaProps, sendEnabled, value]
    );

    const sendSizeClass = layout === 'inline' ? styles.send40 : undefined;

    const sendControl = streaming ? (
      <button
        type="button"
        className={mergeClassNames(styles.send, sendSizeClass, styles.sendEnabled)}
        onClick={handleSendClick}
        onMouseDown={(e) => e.preventDefault()}
        disabled={disabled}
        aria-label="Stop generating"
      >
        <Stop color="black" size={16} aria-hidden />
      </button>
    ) : (
      <button
        type="submit"
        className={mergeClassNames(sendClass, sendSizeClass)}
        disabled={!sendEnabled}
        onMouseDown={(e) => {
          if (sendEnabled) e.preventDefault();
        }}
        aria-label="Send message"
      >
        <UpArrow color="black" size={16} aria-hidden />
      </button>
    );

    return (
      <form ref={setFormRef} className={rootClass} onSubmit={handleSubmit} {...formAttrs}>
        {layout === 'inline' ? (
          <div className={styles.inlineRow}>
            <div className={styles.fieldRow}>
              <div className={styles.inputWrap}>
                <textarea
                  {...restTextareaProps}
                  ref={setTextareaRef}
                  id={fieldId}
                  rows={1}
                  className={mergeClassNames(styles.textarea, styles.textareaInline, restTextareaProps.className)}
                  value={value}
                  onChange={handleChange}
                  onKeyDown={handleTextareaKeyDown}
                  placeholder={placeholderText}
                  disabled={disabled}
                  onFocus={handleTextareaFocus}
                  onBlur={handleTextareaBlur}
                  aria-label={restTextareaProps['aria-label'] ?? 'Message'}
                />
                {showAnimatedPlaceholder ? (
                  <div className={styles.animatedPlaceholder} aria-hidden>
                    <span>{rotatingPlaceholderPrefix}</span>
                    <span>{animatedSuffix}</span>
                  </div>
                ) : null}
              </div>
            </div>
            <div className={styles.inlineSend}>{sendControl}</div>
          </div>
        ) : (
          <>
            <div className={styles.fieldRow}>
              <div className={styles.inputWrap}>
                <textarea
                  {...restTextareaProps}
                  ref={setTextareaRef}
                  id={fieldId}
                  rows={1}
                  className={mergeClassNames(styles.textarea, restTextareaProps.className)}
                  value={value}
                  onChange={handleChange}
                  onKeyDown={handleTextareaKeyDown}
                  placeholder={placeholderText}
                  disabled={disabled}
                  onFocus={handleTextareaFocus}
                  onBlur={handleTextareaBlur}
                  aria-label={restTextareaProps['aria-label'] ?? 'Message'}
                />
                {showAnimatedPlaceholder ? (
                  <div className={styles.animatedPlaceholder} aria-hidden>
                    <span>{rotatingPlaceholderPrefix}</span>
                    <span>{animatedSuffix}</span>
                  </div>
                ) : null}
              </div>
            </div>
            <div className={styles.footer}>{sendControl}</div>
          </>
        )}
      </form>
    );
  }
);
