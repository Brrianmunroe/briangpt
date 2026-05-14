'use client';

import { HeroImageHotspots, type HeroHotspotConfig } from '@/components/hero-image-hotspots';
import { selectAiImg } from '@/app/work/selectai/select-ai-assets';

/**
 * Positions from Figma Frame 179 (663:83): indicator centers as % of inner `image 41` (663:84)
 * bounds (x=32, y≈33.429, w=1056, h≈659.142). Geometry only — no Figma assets in code.
 */
const HOTSPOTS: readonly HeroHotspotConfig[] = [
  {
    id: 'h-timeline',
    leftPct: 37.41,
    topPct: 71.84,
    corner: 'bottom-left',
    title: 'Tandem Editing',
    body: 'Edit in transcript or timeline; every cut stays synced so you keep precise narrative control.',
    mediaSrc: selectAiImg.tandemTimelineHighlightVideo,
    mediaKind: 'video',
    mediaAlt: 'Tandem timeline: selection linked to transcript and playback',
  },
  {
    id: 'h-transcript-top',
    leftPct: 37.41,
    topPct: 18.65,
    corner: 'top-left',
    title: 'Highlight Transparency',
    body: 'See why each highlight was chosen and how it fits your story, before you export.',
    mediaSrc: selectAiImg.reasoningHighlightVideo,
    mediaKind: 'video',
    mediaAlt: 'Reasoning and transcript-first editing in the interview flow',
  },
  {
    id: 'h-video-bottom',
    leftPct: 84.56,
    topPct: 54.38,
    corner: 'bottom-right',
    title: 'Native-Feeling Toolbar',
    body: 'Familiar toolbar, icons, and hotkeys mirroring major NLEs, making SelexAI instantly comfortable.',
    mediaSrc: selectAiImg.toolbarHighlightVideo,
    mediaKind: 'video',
    mediaAlt: 'Toolbar with review and timeline actions',
  },
  {
    id: 'h-sidebar',
    leftPct: 11.65,
    topPct: 14.65,
    corner: 'top-left',
    title: 'Familiar Pro Layout',
    body: 'Built like Premiere, Final Cut, and Resolve, so it slots directly into existing workflows.',
    mediaSrc: selectAiImg.nlesHighlightVideo,
    mediaKind: 'video',
    mediaAlt: 'Overview of common non-linear editing applications',
  },
];

export type SelectAiHeroHotspotsProps = {
  src: string;
  alt?: string;
  imgClassName: string;
};

export function SelectAiHeroHotspots({ src, alt = '', imgClassName }: SelectAiHeroHotspotsProps) {
  return <HeroImageHotspots src={src} alt={alt} imgClassName={imgClassName} hotspots={HOTSPOTS} />;
}
