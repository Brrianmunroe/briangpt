import type { CaseStudy } from '@/lib/case-studies';
import { curioGalleryVideos, curioImg } from './curio-assets';
import styles from './curio-case-study.module.css';

export function CurioCaseStudy({ study }: { study: CaseStudy }) {
  return (
    <article className={styles.root}>
      <div className={styles.heroTop}>
        <div className={styles.headlineCol}>
          <div className={styles.titleBlock}>
            <h1 className={styles.title}>{study.title}</h1>
            <p className={styles.subtitle}>{study.subtitle}</p>
          </div>
          <div className={styles.toolsWrap}>
            <p className={styles.toolsLabel}>Tools</p>
            <div className={styles.toolRow}>
              <div className={styles.toolStripClip}>
                <img
                  src={curioImg.toolIconsStrip}
                  alt=""
                  width={108}
                  height={21}
                  className={styles.toolStrip}
                />
              </div>
            </div>
          </div>
        </div>
        <div className={styles.narrativeCol}>
          <p className={styles.body}>{study.description}</p>
        </div>
      </div>

      <div className={styles.mediaSlot}>
        <img src={curioImg.screenCollage} alt="" className={styles.fillMedia} />
      </div>

      <div className={styles.mediaPair}>
        <img
          src={curioImg.curioLogo}
          alt="Curio logo"
          className={styles.fillMedia}
        />
        <img
          src={curioImg.colorPalette}
          alt="Color palette"
          className={styles.fillMedia}
        />
      </div>

      <div className={styles.mediaSlot}>
        <img
          src={curioImg.componentCollage}
          alt="Curio UI components"
          className={styles.fillMedia}
        />
      </div>

      <div className={styles.mediaPair}>
        <img src={curioImg.chat} alt="Chat concept" className={styles.fillMedia} />
        <img
          src={curioImg.curateSection}
          alt="Curate concept"
          className={styles.fillMedia}
        />
      </div>

      <div className={styles.mediaSlot}>
        <img src={curioImg.flow} alt="User flow" className={styles.fillMedia} />
      </div>

      <div className={styles.mediaSlot}>
        <img
          src={curioImg.designDecisions}
          alt="Design decisions"
          className={styles.fillMedia}
        />
      </div>

      {curioGalleryVideos.length > 0 ? (
        <div className={styles.galleryGrid}>
          {curioGalleryVideos.map((src) => (
            <video
              key={src}
              className={styles.galleryVideo}
              controls
              playsInline
              preload="metadata"
              src={src}
            />
          ))}
        </div>
      ) : null}
    </article>
  );
}
