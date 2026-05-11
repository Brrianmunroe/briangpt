/** Static assets in public/work/curio/ — URLs must match filenames on disk (case + spaces). */
const c = (filename: string) => `/work/curio/${encodeURIComponent(filename)}`;

export const curioImg = {
  /** Cursor / Curio / Copilot-style tool strip (96×32 SVG). */
  toolIconsStrip: c('curio-tools.svg'),
  screenCollage: c('Screen Collage.png'),
  curioLogo: c('Curio Logo.png'),
  colorPalette: c('Color Palette.png'),
  componentCollage: c('Component Collage.png'),
  chat: c('Chat.png'),
  curateSection: c('Curate Section.png'),
  flow: c('Flow.png'),
  designDecisions: c('Design Decsions.png'),
} as const;

/** Bottom grid videos — add MP4/WebM files to public/work/curio/ and list paths here. */
export const curioGalleryVideos: readonly string[] = [];
