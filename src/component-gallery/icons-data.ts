import type { ComponentType } from 'react';
import {
  ArrowNe,
  DownChevron,
  Github,
  Globe,
  Linkedin,
  Mail,
  Menu,
  Plus,
  Prompt,
  Resume,
  Stop,
  UpArrow,
} from '@/components/icons';

export type GalleryIconColor = 'black' | 'orange' | 'grey';

export type GalleryIconComponent = ComponentType<{
  color?: GalleryIconColor;
  size?: number;
  'aria-label'?: string;
}>;

/** Every icon in `src/components/icons` — add a row when you add a file + export. */
export const ICON_SECTIONS: {
  title: string;
  slug: string;
  figmaPath: string;
  Component: GalleryIconComponent;
}[] = [
  { title: 'Up arrow', slug: 'up-arrow', figmaPath: 'icons / up-arrow', Component: UpArrow },
  { title: 'Stop', slug: 'stop', figmaPath: 'icons / stop', Component: Stop },
  { title: 'Globe', slug: 'globe', figmaPath: 'icons / globe', Component: Globe },
  { title: 'Down chevron', slug: 'down-chevron', figmaPath: 'icons / down-chevron', Component: DownChevron },
  { title: 'Plus', slug: 'plus', figmaPath: 'icons / plus', Component: Plus },
  { title: 'Prompt', slug: 'prompt', figmaPath: 'icons / prompt', Component: Prompt },
  { title: 'Menu', slug: 'menu', figmaPath: 'icons / menu', Component: Menu },
  { title: 'GitHub', slug: 'github', figmaPath: 'icons / github', Component: Github },
  { title: 'LinkedIn', slug: 'linkedin', figmaPath: 'icons / linkedin', Component: Linkedin },
  { title: 'Mail', slug: 'mail', figmaPath: 'icons / mail', Component: Mail },
  { title: 'Resume', slug: 'resume', figmaPath: 'icons / resume', Component: Resume },
  { title: 'Arrow NE', slug: 'arrow-ne', figmaPath: 'icons / Arrow-NE', Component: ArrowNe },
];

export const ICON_COLORS: GalleryIconColor[] = ['black', 'orange', 'grey'];
