'use client';

import { HeroImageHotspots, type HeroHotspotConfig } from '@/components/hero-image-hotspots';
import { curioImg } from '@/app/work/curio/curio-assets';

/**
 * Figma Frame 1 (672:163): indicator centers as % of `image 1` (670:154) bounds w=835, h=565
 * (same origin as Frame 1). Centers = top-left of each 20×20 indicator + 10px.
 */
const CURIO_HOTSPOTS: readonly HeroHotspotConfig[] = [
  {
    id: 'h-671-156',
    leftPct: 64.91,
    topPct: 15.4,
    corner: 'top-left',
    title: 'Status',
    body: 'Placeholder: call out status or header region on the device.',
  },
  {
    id: 'h-672-164',
    leftPct: 60.12,
    topPct: 22.65,
    corner: 'top-left',
    title: 'Primary content',
    body: 'Placeholder: describe the main canvas or feed area.',
  },
  {
    id: 'h-672-166',
    leftPct: 60.12,
    topPct: 36.64,
    corner: 'top-left',
    title: 'Interaction',
    body: 'Placeholder: note taps, gestures, or controls in this zone.',
  },
  {
    id: 'h-672-168',
    leftPct: 59.64,
    topPct: 59.82,
    corner: 'bottom-left',
    title: 'Detail',
    body: 'Placeholder: secondary panel or metadata tied to selection.',
  },
  {
    id: 'h-672-170',
    leftPct: 36.17,
    topPct: 64.96,
    corner: 'bottom-right',
    title: 'Navigation',
    body: 'Placeholder: tab bar, back affordance, or wayfinding.',
  },
  {
    id: 'h-672-172',
    leftPct: 36.17,
    topPct: 78.76,
    corner: 'bottom-right',
    title: 'Actions',
    body: 'Placeholder: primary actions or composer entry.',
  },
  {
    id: 'h-672-176',
    leftPct: 63.71,
    topPct: 85.66,
    corner: 'bottom-left',
    title: 'Context',
    body: 'Placeholder: contextual tools or overflow.',
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
