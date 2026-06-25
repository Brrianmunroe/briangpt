'use client';

import { HeroImageHotspots, type HeroHotspotConfig } from '@/components/hero-image-hotspots';
import { curioImg, curioVideo } from '@/app/work/curio/curio-assets';

/**
 * Figma Frame 1 (672:163): indicator centers as % of `image 1` (670:154) bounds w=835, h=565
 * (same origin as Frame 1). Centers = top-left of each 20×20 indicator + 10px.
 */
const CURIO_HOTSPOTS: readonly HeroHotspotConfig[] = [
  {
    id: 'h-672-164',
    leftPct: 60.12,
    topPct: 22.65,
    corner: 'top-left',
    title: 'Expandable',
    body: 'Get a more in-depth look at your custom playlist',
    mediaSrc: curioVideo.expandable,
    mediaKind: 'video',
    mediaAlt: 'Expanding the custom playlist into a full detailed view',
  },
  {
    id: 'h-672-166',
    leftPct: 60.12,
    topPct: 36.64,
    corner: 'top-left',
    title: 'Quick Swap',
    body: 'No need to prompt for micro adjustments, customize quickly.',
    mediaSrc: curioVideo.swapSong,
    mediaKind: 'video',
    mediaAlt: 'Swapping a song in the playlist with a single tap',
  },
  {
    id: 'h-672-172',
    leftPct: 36.17,
    topPct: 78.76,
    corner: 'bottom-right',
    title: 'Prompt Chips',
    body: 'Designed to reduce cognitive load and quickly update your playlist',
    mediaSrc: curioVideo.promptChips,
    mediaKind: 'video',
    mediaAlt: 'Tapping a prompt chip to quickly update the playlist',
  },
];

export type CurioHeroHotspotsProps = {
  imgClassName: string;
  alt?: string;
};

export function CurioHeroHotspots({ imgClassName, alt = 'Curio product interface' }: CurioHeroHotspotsProps) {
  return (
    <HeroImageHotspots
      src={curioImg.frame1Hero}
      alt={alt}
      imgClassName={imgClassName}
      hotspots={CURIO_HOTSPOTS}
    />
  );
}
