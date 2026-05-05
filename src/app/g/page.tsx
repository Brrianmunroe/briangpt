import type { Metadata } from 'next';
import { GalleryPageBody } from '@/component-gallery/GalleryPageBody';
import { SiteNav } from '@/component-gallery/SiteNav';

export const metadata: Metadata = {
  title: 'Gallery — BrianGPT',
};

/** Short URL mirror of `/gallery` (same UI) for environments where `/gallery` is mis-served. */
export default function ShortGalleryPage() {
  return (
    <GalleryPageBody
      layout="standalone"
      heading="Component gallery"
      includeIcons
      idPrefix=""
      showRouteFallbackNote
      navSlot={<SiteNav current="g" />}
    />
  );
}
