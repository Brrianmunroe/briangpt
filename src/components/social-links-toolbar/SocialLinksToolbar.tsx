'use client';

import * as React from 'react';
import { Github, Globe, Linkedin, Mail } from '@/components/icons';
import styles from './SocialLinksToolbar.module.css';

export type SocialLinksToolbarProps = Omit<React.HTMLAttributes<HTMLElement>, 'children'> & {
  /**
   * `full` — Figma `SocialLinks` with theme + website CTA.
   * `links` — Figma `Links` (145:707): LinkedIn, GitHub, Mail only.
   */
  variant?: 'full' | 'links';
  linkedinHref: string;
  githubHref: string;
  mailHref: string;
  websiteHref?: string;
  linkedinAriaLabel?: string;
  githubAriaLabel?: string;
  mailAriaLabel?: string;
  websiteAriaLabel?: string;
  themeAriaLabel?: string;
  /** Reflects whether the theme control is in its alternate state (paired with `onToggleTheme`). */
  themePressed?: boolean;
  onToggleTheme?: () => void;
};

export const SocialLinksToolbar = React.forwardRef<HTMLElement, SocialLinksToolbarProps>(
  function SocialLinksToolbar(
    {
      className,
      variant = 'full',
      linkedinHref,
      githubHref,
      mailHref,
      websiteHref = '#',
      linkedinAriaLabel = 'LinkedIn',
      githubAriaLabel = 'GitHub',
      mailAriaLabel = 'Email',
      websiteAriaLabel = 'Website',
      themeAriaLabel = 'Toggle color theme',
      themePressed = false,
      onToggleTheme,
      ...rest
    },
    ref
  ) {
    const rootClass = [styles.root, variant === 'links' && styles.rootLinksOnly, className]
      .filter(Boolean)
      .join(' ');

    return (
      <nav ref={ref} className={rootClass} aria-label="Site toolbar" {...rest}>
        <a
          href={linkedinHref}
          className={styles.hit}
          aria-label={linkedinAriaLabel}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Linkedin color="grey" size={16} />
        </a>
        <a
          href={githubHref}
          className={styles.hit}
          aria-label={githubAriaLabel}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Github color="grey" size={16} />
        </a>
        <a href={mailHref} className={styles.hit} aria-label={mailAriaLabel}>
          <Mail color="grey" size={16} />
        </a>
        {variant === 'full' ? (
          <>
            <span className={styles.divider} role="separator" aria-hidden />
            <button
              type="button"
              className={styles.hit}
              aria-label={themeAriaLabel}
              aria-pressed={themePressed}
              onClick={() => onToggleTheme?.()}
            >
              <Globe color="grey" size={16} />
            </button>
            <a
              href={websiteHref}
              className={styles.website}
              aria-label={websiteAriaLabel}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Globe color="black" size={16} aria-hidden />
              <span className={styles.websiteLabel}>Website</span>
            </a>
          </>
        ) : null}
      </nav>
    );
  }
);
