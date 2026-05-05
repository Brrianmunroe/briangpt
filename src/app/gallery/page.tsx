import type { Metadata } from 'next';
import { GalleryPageBody } from '@/component-gallery/GalleryPageBody';
import { SiteNav } from '@/component-gallery/SiteNav';

export const metadata: Metadata = {
  title: 'Component gallery — BrianGPT',
};

export default function GalleryPage() {
  return (
    <GalleryPageBody
      layout="standalone"
      heading="Component gallery"
      includeIcons
      idPrefix=""
      showRouteFallbackNote
      navSlot={<SiteNav current="gallery" />}
    />
  );
}
