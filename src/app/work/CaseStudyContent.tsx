import Link from 'next/link';
import type { CSSProperties } from 'react';
import type { CaseStudy } from '@/lib/case-studies';
import styles from './[slug]/case-study.module.css';

export function CaseStudyContent({ study }: { study: CaseStudy }) {
  return (
    <article className={styles.root}>
      <div className={styles.heroGrid}>
        <div className={styles.headlineBlock} data-stagger style={{ '--stagger-index': 0 } as CSSProperties}>
          <div>
            <h1 className={styles.title}>{study.title}</h1>
            <p className={styles.subtitle}>{study.subtitle}</p>
          </div>
          <p className={styles.lede}>{study.description}</p>
          <div className={styles.ctaRow}>
            <Link className={styles.ctaPrimary} href="/">
              Back to portfolio
            </Link>
            <a className={styles.ctaGhost} href="mailto:brian_munroe@icloud.com">
              Get in touch
            </a>
          </div>
        </div>
        <ul className={styles.featureList} data-stagger style={{ '--stagger-index': 1 } as CSSProperties}>
          {study.features.map((feature) => (
            <li key={feature} className={styles.featureItem}>
              <span className={styles.check} aria-hidden>
                ✓
              </span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.panelGrid}>
        {study.panels.map((panel, i) => (
          <section
            key={panel.heading}
            className={styles.panel}
            data-stagger
            style={{ '--stagger-index': i + 2 } as CSSProperties}
          >
            <h2 className={styles.panelTitle}>{panel.heading}</h2>
            <p className={styles.panelBody}>{panel.body}</p>
          </section>
        ))}
      </div>
    </article>
  );
}
