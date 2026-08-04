import Link from 'next/link';
import type { ReactNode } from 'react';
import styles from './work-shell.module.css';

export function WorkDirectShell({
  children,
  headerExtraGap = false,
  selectAiSurface = false,
}: {
  children: ReactNode;
  headerExtraGap?: boolean;
  selectAiSurface?: boolean;
}) {
  return (
    <main className={styles.directScene}>
      <div className={`${styles.card} ${styles.directCard} ${selectAiSurface ? styles.cardSelectAi : ''}`}>
        <div
          className={[
            styles.cardHeader,
            headerExtraGap ? styles.cardHeaderGhost : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <Link className={styles.directClose} href="/" aria-label="Close case study">
            <CloseGlyph />
          </Link>
        </div>
        <div className={styles.cardBody}>{children}</div>
      </div>
    </main>
  );
}

function CloseGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        d="M4 4l8 8M12 4l-8 8"
      />
    </svg>
  );
}
