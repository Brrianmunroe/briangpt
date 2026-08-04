import type { CaseStudy } from '@/lib/case-studies';
import type { CSSProperties } from 'react';
import { SelectAiHeroHotspots } from '@/components/select-ai-hero-hotspots/SelectAiHeroHotspots';
import { SelectAiSummaryCarousel } from './SelectAiSummaryCarousel';
import { selectAiImg } from './select-ai-assets';
import styles from './select-ai-case-study.module.css';

const toolIcons = [
  { src: selectAiImg.toolPerplexity, label: 'Perplexity' },
  { src: selectAiImg.toolCursor, label: 'Cursor' },
  { src: selectAiImg.toolFigma, label: 'Figma' },
  { src: selectAiImg.toolAvatar, label: 'AI image generation' },
] as const;

const decisions = [
  {
    label: 'Iteration 02',
    title: 'A creative brief keeps the editor in control',
    body: 'Editors can define the story, audience, and key themes before the AI reviews their footage.',
    image: selectAiImg.decisionBrief,
    imageAlt: 'Creative brief form in SelexAI',
    imageClass: styles.decisionBrief,
  },
  {
    label: 'Iteration 04',
    title: 'Exporting to existing tools kept the product focused',
    body: 'Rather than replacing professional editing software, SelexAI solves the most time-consuming step and exports the timeline into the editor’s preferred NLE.',
    image: selectAiImg.decisionExport,
    imageAlt: 'SelexAI export options for professional editing tools',
    imageClass: styles.decisionExport,
  },
] as const;

export function SelectAiCaseStudy({ study }: { study: CaseStudy }) {
  return (
    <article className={styles.root}>
      <header className={styles.hero} data-case-section="hero">
        <div className={styles.heroContent} data-stagger style={{ '--stagger-index': 0 } as CSSProperties}>
          <div className={styles.heroIntro}>
            <h1 className={styles.heroTitle}>
              {study.title}<span className={styles.accent}>.</span>
            </h1>
            <p className={styles.bodySecondary}>
              SelexAI helps video editors surface the most important moments from hours of interview footage, without giving up creative control.
            </p>
          </div>

          <div className={styles.heroMetric}>
            <p className={styles.eyebrow}>Results</p>
            <div className={styles.heroMetricRow}>
              <strong>30%</strong>
              <span>in estimated<br />time savings</span>
            </div>
          </div>

          <div className={styles.heroMetaBlock}>
            <p className={styles.eyebrow}>Tools</p>
            <ul className={styles.toolList} aria-label="Tools used">
              {toolIcons.map((tool) => (
                <li key={tool.label} className={styles.toolItem}>
                  <img src={tool.src} alt={tool.label} />
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.heroMetaBlock}>
            <p className={styles.eyebrow}>Project Type</p>
            <p className={styles.projectType}>Personal</p>
          </div>
        </div>

        <div className={styles.heroMedia} data-stagger style={{ '--stagger-index': 1 } as CSSProperties}>
          <img src={selectAiImg.caseHero} alt="SelexAI interview editing workspace" />
        </div>
      </header>

      <section className={styles.section} data-case-section="overview">
        <SectionHeading eyebrow="Project at a glance" title="The full story, in under 30 seconds" />
        <SelectAiSummaryCarousel />
      </section>

      <section className={styles.section} data-case-section="problem">
        <div className={styles.splitSection}>
          <SectionHeading
            eyebrow="The Problem"
            title="Editors spend hours searching for the moments that shape the story"
            body="Reviewing interviews, marking key moments, and cutting selects is slow, repetitive work that delays the creative process."
          />
          <MetricCard value="5/6" label="videographers said cutting interview selects was their biggest post-production bottleneck." />
        </div>

        <div className={styles.quoteCard}>
          <div className={styles.quoteContent}>
            <p className={styles.darkBody}>Quote</p>
            <blockquote>“The grind is the post production, the culling through all the footage.”</blockquote>
            <cite>— Interview participant</cite>
          </div>
          <div className={styles.quoteImageCrop}>
            <img
              src={selectAiImg.problemQuotePerson}
              alt="Videographer holding a professional camera"
            />
          </div>
        </div>
      </section>

      <section className={styles.section} data-case-section="prototype">
        <div className={styles.splitSection}>
          <SectionHeading
            eyebrow="Prototyping and testing"
            title="I went from sketch to tested prototype in 24 hours"
            body="Before investing in a polished solution, I built the core workflow in Figma Make and tested it the following day using a Likert scale to measure ease of use."
          />
          <MetricCard value="4.25/5" label="average ease of use score from participants." />
        </div>

      </section>

      <section className={styles.decisionSection} data-case-section="trust-and-iterations">
        <div className={styles.trustIntro}>
          <SectionHeading
            eyebrow="Key Insight & Designing For Trust"
            title="Usability wasn't the challenge, trust was"
            body="Editors understood the workflow, but worried AI might overlook a detail that mattered to the story. This shifted my focus from automating the process to building trust within the product, making every AI decision visible and reversible."
          />
          <div className={styles.productPreview}>
            <SelectAiHeroHotspots
              src={selectAiImg.caseHero}
              alt="SelexAI product preview"
              imgClassName={styles.productPreviewImage}
            />
          </div>
        </div>

        <div className={styles.decisionList}>
          {decisions.map((decision, index) => (
            <article className={styles.decisionRow} key={`${decision.label}-${decision.title}`} data-decision={index + 1}>
              <div className={styles.decisionCopy}>
                <p className={styles.iterationLabel}>{decision.label}</p>
                <h3>{decision.title}</h3>
                <p>{decision.body}</p>
              </div>
              <img
                className={`${styles.decisionImage} ${decision.imageClass}`}
                src={decision.image}
                alt={decision.imageAlt}
              />
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section} data-case-section="design-system">
        <SectionHeading
          eyebrow="Design system"
          title="Consistency helped turn the concept into a credible product"
          body="A reusable design system allowed me to build the MVP faster in Cursor while keeping interactions and visual patterns consistent across the experience."
        />
        <img
          className={styles.designSystemImage}
          src={selectAiImg.designSystemComponents}
          alt="SelexAI design system components, colors, type styles, and interface patterns"
        />
      </section>

      <section className={styles.section} data-case-section="outcome">
        <div className={styles.splitSection}>
          <SectionHeading
            eyebrow="Outcome"
            title="Early testing showed meaningful potential"
            body="Testers estimated SelexAI could reduce post-production time by up to 30%. This is a directional estimate from early testing, not yet a measured production result."
          />
          <MetricCard value="Up to 30%" label="estimated post-production time savings" />
        </div>
      </section>

      <div className={styles.outcomeImage} data-case-section="outcome-image">
        <img src={selectAiImg.outcomeLaptops} alt="SelexAI displayed across two laptop screens" />
      </div>
    </article>
  );
}

function SectionHeading({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body?: string;
}) {
  return (
    <div className={styles.sectionHeading}>
      <p className={styles.eyebrow}>{eyebrow}</p>
      <h2>{title}<span className={styles.accent}>.</span></h2>
      {body ? <p className={styles.bodySecondary}>{body}</p> : null}
    </div>
  );
}

function MetricCard({ value, label }: { value: string; label: string }) {
  return (
    <div className={styles.metricCard}>
      <strong>{value}</strong>
      <p>{label}</p>
    </div>
  );
}
