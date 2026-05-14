import type { CaseStudy } from '@/lib/case-studies';
import { SelectAiHeroHotspots } from '@/components/select-ai-hero-hotspots/SelectAiHeroHotspots';
import { curioImg } from '../curio/curio-assets';
import curioStyles from '../curio/curio-case-study.module.css';
import { selectAiImg } from './select-ai-assets';
import styles from './select-ai-case-study.module.css';

export function SelectAiCaseStudy({ study }: { study: CaseStudy }) {
  return (
    <article className={styles.root}>
      <div className={`${curioStyles.heroTop} ${styles.heroTopFlexChild}`}>
        <div className={curioStyles.headlineCol}>
          <div className={curioStyles.titleBlock}>
            <h1 className={curioStyles.title}>{study.title}</h1>
            <p className={curioStyles.subtitle}>{study.subtitle}</p>
          </div>
          <div className={curioStyles.toolsWrap}>
            <p className={curioStyles.toolsLabel}>Tools</p>
            <div className={curioStyles.toolRow}>
              <img
                src={curioImg.toolIconsStrip}
                alt=""
                width={108}
                height={21}
                className={curioStyles.toolStrip}
              />
            </div>
          </div>
        </div>
        <div className={curioStyles.narrativeCol}>
          <p className={curioStyles.body}>{study.description}</p>
        </div>
      </div>

      <SelectAiHeroHotspots src={selectAiImg.hero} alt="" imgClassName={styles.blockImg} />

      <div className={styles.rowEqual}>
        <img
          src={selectAiImg.collage}
          alt="Video editing interface with transcript and timeline"
          className={styles.blockImg}
        />
        <img
          src={selectAiImg.designDocumentation}
          alt="Design documentation and UI kit samples"
          className={styles.blockImg}
        />
      </div>

      <img
        src={selectAiImg.designSystem}
        alt="Component library and UI patterns"
        className={styles.blockImg}
      />

      <div className={styles.rowEqual}>
        <img
          src={selectAiImg.prototype}
          alt="Prototype of interview select workflow"
          className={styles.blockImg}
        />
        <img src={selectAiImg.highfi} alt="High fidelity editor interface" className={styles.blockImg} />
      </div>

      <img src={selectAiImg.flow} alt="User flow across SelexAI" className={styles.blockImg} />

      <img src={selectAiImg.designDecisions} alt="Design decisions" className={styles.blockImg} />

      <img src={selectAiImg.upload} alt="Upload media experience" className={styles.blockImg} />

      <img src={selectAiImg.contextBrief} alt="Context brief" className={styles.blockImg} />

      <img src={selectAiImg.timeline} alt="Timeline" className={styles.blockImg} />

      <img src={selectAiImg.reasoning} alt="Reasoning and AI transparency" className={styles.blockImg} />
    </article>
  );
}
