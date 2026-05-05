import { ICON_COLORS, ICON_SECTIONS } from './icons-data';
import styles from './IconsGrid.module.css';

type Props = {
  /** In-page anchor links to each icon card */
  showJumpNav?: boolean;
};

export function IconsGrid({ showJumpNav = true }: Props) {
  return (
    <>
      <section className={styles.section} aria-labelledby="gallery-icons-heading">
        <h2 id="gallery-icons-heading" className={styles.h2}>
          Icons ({ICON_SECTIONS.length} components × {ICON_COLORS.length} colors)
        </h2>
        <p className={styles.lead}>
          Each icon uses <code>color</code> → <code>--color-icon-surface-*</code> from{' '}
          <code>design-tokens/tokens.css</code>. Hover and focus the SVGs to confirm hit targets
          feel right in context.
        </p>
        <div className={styles.grid}>
          {ICON_SECTIONS.map(({ title, slug, figmaPath, Component }) => (
            <article key={slug} id={slug} className={styles.card}>
              <h3 className={styles.cardTitle}>{title}</h3>
              <p className={styles.meta}>
                <code>{figmaPath}</code>
              </p>
              <div className={styles.swatches}>
                {ICON_COLORS.map((color) => (
                  <div key={color} className={styles.swatch}>
                    <Component color={color} size={24} aria-label={`${title}, ${color}`} />
                    <code className={styles.swatchLabel}>{color}</code>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      {showJumpNav ? (
        <section className={styles.section} aria-labelledby="jump-icons-heading">
          <h2 id="jump-icons-heading" className={styles.h3}>
            Jump to icon
          </h2>
          <nav className={styles.jump}>
            {ICON_SECTIONS.map(({ title, slug }) => (
              <a key={slug} href={`#${slug}`} className={styles.jumpLink}>
                {title}
              </a>
            ))}
          </nav>
        </section>
      ) : null}
    </>
  );
}
