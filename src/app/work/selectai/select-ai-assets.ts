/** Static assets in public/work/selexAI/ — URLs must match filenames on disk (case + spaces). */
const s = (filename: string) => `/work/selexAI/${encodeURIComponent(filename)}`;

export const selectAiImg = {
  hero: s('Hero.png'),
  collage: s('collage.png'),
  designDocumentation: s('design documentation.png'),
  designSystem: s('design system.png'),
  prototype: s('prototype.png'),
  highfi: s('highfi.png'),
  flow: s('flow.png'),
  designDecisions: s('design decisions.png'),
  upload: s('upload.png'),
  contextBrief: s('context brief.png'),
  timeline: s('timeline.png'),
  reasoning: s('reasoning.png'),
} as const;
