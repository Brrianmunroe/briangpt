'use client';

import * as React from 'react';
import { selectAiImg } from './select-ai-assets';
import styles from './select-ai-case-study.module.css';

const SLIDE_COUNT = 4;

export function SelectAiSummaryCarousel() {
  const viewportRef = React.useRef<HTMLDivElement | null>(null);
  const frameRef = React.useRef<number | null>(null);
  const [activeSlide, setActiveSlide] = React.useState(0);

  const goToSlide = React.useCallback((index: number, behavior: ScrollBehavior = 'smooth') => {
    const viewport = viewportRef.current;
    const slide = viewport?.children.item(index) as HTMLElement | null;
    if (!viewport || !slide) return;
    viewport.scrollTo({ left: slide.offsetLeft, behavior });
    setActiveSlide(index);
  }, []);

  const syncActiveSlide = React.useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;
    Array.from(viewport.children).forEach((child, index) => {
      const distance = Math.abs((child as HTMLElement).offsetLeft - viewport.scrollLeft);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });
    setActiveSlide(closestIndex);
  }, []);

  const handleScroll = React.useCallback(() => {
    if (frameRef.current != null) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(syncActiveSlide);
  }, [syncActiveSlide]);

  React.useEffect(
    () => () => {
      if (frameRef.current != null) cancelAnimationFrame(frameRef.current);
    },
    [],
  );

  React.useEffect(() => {
    const handleResize = () => goToSlide(activeSlide, 'auto');
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeSlide, goToSlide]);

  return (
    <div className={styles.carousel} aria-label="Project summary carousel">
      <div
        ref={viewportRef}
        className={styles.carouselViewport}
        onScroll={handleScroll}
        onKeyDown={(event) => {
          if (event.key === 'ArrowLeft') {
            event.preventDefault();
            goToSlide(Math.max(0, activeSlide - 1));
          }
          if (event.key === 'ArrowRight') {
            event.preventDefault();
            goToSlide(Math.min(SLIDE_COUNT - 1, activeSlide + 1));
          }
        }}
        tabIndex={0}
      >
        <article className={styles.summaryCard} aria-label="1 of 4: The problem">
          <img className={styles.problemGlow} src={selectAiImg.glanceGlowProblem} alt="" />
          <img
            className={styles.problemIllustration}
            src={selectAiImg.glanceProblem}
            alt="Editor reviewing interview footage"
          />
          <SummaryCopy
            className={styles.problemCopy}
            label="The Problem"
            title="Hours of footage stood between editors and the story."
            body="Corporate interview projects require editors to review, mark, and cut hours of footage before the creative edit can begin."
          />
        </article>

        <article className={styles.summaryCard} aria-label="2 of 4: The insight">
          <img className={styles.insightGlow} src={selectAiImg.glanceGlowInsight} alt="" />
          <img
            className={styles.insightIllustration}
            src={selectAiImg.glanceInsight}
            alt="Editor considering an AI-assisted workflow"
          />
          <SummaryCopy
            className={styles.insightCopy}
            label="The Insight"
            title="Editors needed help they could trust"
            body="Research showed that editors were open to AI assistance, but worried it might overlook a quote or detail that mattered."
          />
        </article>

        <article className={styles.summaryCard} aria-label="3 of 4: The solution">
          <img className={styles.solutionGlow} src={selectAiImg.glanceGlowSolution} alt="" />
          <img className={styles.solutionIllustration} src={selectAiImg.glanceSolution} alt="SelexAI editing workspace" />
          <SummaryCopy
            className={styles.solutionCopy}
            label="The Solution"
            title="SelexAI keeps editors in control of every decision"
            body="Editors provide a creative brief, review AI-selected highlights, understand why each was chosen, and refine them directly in the transcript or timeline."
          />
        </article>

        <article className={styles.summaryCard} aria-label="4 of 4: The outcome">
          <img className={styles.outcomeGlow} src={selectAiImg.glanceGlowOutcome} alt="" />
          <img
            className={styles.glanceOutcomeIllustration}
            src={selectAiImg.glanceOutcome}
            alt="SelexAI timeline and program monitor"
          />
          <SummaryCopy
            className={styles.glanceOutcomeCopy}
            label="The Outcome"
            title={<>Less time reviewing,<br />more time shaping the story</>}
            body="Editors can organize their strongest interview moments and export the timeline into their preferred editing software."
          />
        </article>
      </div>

      <div className={styles.carouselIndicators} aria-label="Choose a summary slide">
        {Array.from({ length: SLIDE_COUNT }, (_, index) => (
          <button
            key={index}
            type="button"
            className={`${styles.carouselIndicator} ${index === activeSlide ? styles.carouselIndicatorActive : ''}`}
            aria-label={`Show summary slide ${index + 1}`}
            aria-current={index === activeSlide ? 'true' : undefined}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
}

function SummaryCopy({
  className,
  label,
  title,
  body,
}: {
  className: string;
  label: string;
  title: React.ReactNode;
  body: string;
}) {
  return (
    <div className={`${styles.summaryCopy} ${className}`}>
      <p className={styles.summaryLabel}>{label}</p>
      <h3 className={styles.summaryCardTitle}>{title}</h3>
      <p className={styles.summaryCardBody}>{body}</p>
    </div>
  );
}
