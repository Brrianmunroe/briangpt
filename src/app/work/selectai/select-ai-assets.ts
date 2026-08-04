/** Static assets in public/work/selexAI/ — encode each path segment (spaces etc.), keep `/` literal. */
const s = (filename: string) =>
  `/work/selexAI/${filename.split('/').map((seg) => encodeURIComponent(seg)).join('/')}`;

/** Bump this when you replace MP4s in place under `public/work/selexAI/videos/` so browsers refetch. */
const SELECT_AI_VIDEO_CACHE = '5';

export const selectAiImg = {
  caseHero: s('case-hero.png'),
  toolPerplexity: s('tool-perplexity.svg'),
  toolCursor: s('tool-cursor.png'),
  toolFigma: s('tool-figma.svg'),
  toolAvatar: s('tool-avatar.png'),
  glanceProblem: s('glance-problem.png'),
  glanceInsight: s('glance-insight.png'),
  glanceSolution: s('glance-solution.png'),
  glanceOutcome: s('glance-outcome.png'),
  glanceGlowProblem: s('glance-glow-problem.svg'),
  glanceGlowInsight: s('glance-glow-insight.svg'),
  glanceGlowSolution: s('glance-glow-solution.svg'),
  glanceGlowOutcome: s('glance-glow-outcome.svg'),
  problemQuotePerson: s('problem-quote-person.png'),
  decisionPlatform: s('decision-platform.png'),
  decisionBrief: s('decision-brief.png'),
  decisionReasoning: s('decision-reasoning.png'),
  decisionExport: s('decision-export.png'),
  designSystemComponents: s('design-system-components.png'),
  outcomeLaptops: s('outcome-laptops.png'),
  /** Highlight card — reasoning / transcript intelligence (`public/work/selexAI/videos/Reasoning.mp4`). */
  reasoningHighlightVideo: `${s('videos/Reasoning.mp4')}?v=${SELECT_AI_VIDEO_CACHE}`,
  /** Highlight card — toolbar / transport strip (`public/work/selexAI/videos/Toolbar.mp4`). */
  toolbarHighlightVideo: `${s('videos/Toolbar.mp4')}?v=${SELECT_AI_VIDEO_CACHE}`,
  /** Highlight card — tandem timeline / transcript sync (`public/work/selexAI/videos/Tandem-Timeline.mp4`). */
  tandemTimelineHighlightVideo: `${s('videos/Tandem-Timeline.mp4')}?v=${SELECT_AI_VIDEO_CACHE}`,
  /** Highlight card — NLEs overview loop (`public/work/selexAI/videos/NLEs.mp4`). */
  nlesHighlightVideo: `${s('videos/NLEs.mp4')}?v=${SELECT_AI_VIDEO_CACHE}`,
  /** 16:9 placeholder for program-monitor / video-frame highlight cards */
  videoFramePlaceholder: s('video-frame-placeholder.svg'),
  hero: s('Hero.png'),
  collage: s('collage.png'),
  designDocumentation: s('design documentation.png'),
  designSystem: s('design system.png'),
  prototype: s('prototype.png'),
  highfi: s('highfi.png'),
  flow: s('flow.png'),
  upload: s('upload.png'),
  contextBrief: s('context brief.png'),
  /** Full timeline / program layout screen (`public/work/selexAI/SelexAI-Timeline-Screen.png`). */
  timeline: s('timeline.png'),
  reasoning: s('reasoning.png'),
} as const;
