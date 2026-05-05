import Link from 'next/link';
import styles from './SiteNav.module.css';

export type SiteNavKey = 'home' | 'gallery' | 'g';

type Props = {
  current: SiteNavKey;
};

export function SiteNav({ current }: Props) {
  const galleryActive = current === 'gallery' || current === 'g';

  return (
    <nav className={styles.nav} aria-label="Site sections">
      <Link
        href="/"
        className={styles.link}
        aria-current={current === 'home' ? 'page' : undefined}
      >
        Icons
      </Link>
      <Link
        href="/g"
        className={styles.link}
        aria-current={galleryActive ? 'page' : undefined}
      >
        Component gallery
      </Link>
    </nav>
  );
}
