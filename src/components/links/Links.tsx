import * as React from 'react';
import { Github, Linkedin, Mail } from '@/components/icons';
import styles from './Links.module.css';

export type LinksProps = Omit<React.HTMLAttributes<HTMLElement>, 'children'> & {
  /** LinkedIn profile or company URL */
  linkedinHref: string;
  /** GitHub profile or repo URL */
  githubHref: string;
  /** `mailto:` or other mail URL */
  mailHref: string;
  linkedinAriaLabel?: string;
  githubAriaLabel?: string;
  mailAriaLabel?: string;
};

export const Links = React.forwardRef<HTMLElement, LinksProps>(function Links(
  {
    className,
    linkedinHref,
    githubHref,
    mailHref,
    linkedinAriaLabel = 'LinkedIn',
    githubAriaLabel = 'GitHub',
    mailAriaLabel = 'Email',
    ...rest
  },
  ref
) {
  const rootClass = [styles.root, className].filter(Boolean).join(' ');

  return (
    <nav ref={ref} className={rootClass} aria-label="Social links" {...rest}>
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
    </nav>
  );
});
