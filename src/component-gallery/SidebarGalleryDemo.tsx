'use client';

import * as React from 'react';
import { Button } from '@/components/button';
import { Globe } from '@/components/icons';
import { Sidebar, type SidebarDensity } from '@/components/sidebar';
import { SidebarAnimationTuner } from '@/components/sidebar-animation-tuner';
import galleryStyles from './SidebarGalleryDemo.module.css';

const PROJECTS = [
  'Curio',
  'AI Chat Interface',
  'E-commerce Platform',
  'Analytics Dashboard',
] as const;

export function SidebarGalleryDemo() {
  const [active, setActive] = React.useState<string>(PROJECTS[0]);
  const [menuCount, setMenuCount] = React.useState(0);
  const [density, setDensity] = React.useState<SidebarDensity>('comfortable');

  return (
    <div className={galleryStyles.wrap}>
      <div className={galleryStyles.toolbar} role="group" aria-label="Sidebar density">
        <Button
          variant="ghost"
          showIcon={false}
          buttonType="button"
          onClick={() => setDensity((d) => (d === 'comfortable' ? 'compact' : 'comfortable'))}
        >
          {density === 'comfortable' ? 'Collapse rail (91px)' : 'Expand rail (240px)'}
        </Button>
        <span className={galleryStyles.toolbarHint}>
          Figma <code>3:78</code> vs <code>99:1321</code>
        </span>
      </div>
      <div className={galleryStyles.shell} aria-label="Sidebar preview">
      <Sidebar density={density} className={galleryStyles.sidebar}>
        <Sidebar.Stack>
          <Sidebar.HeaderRow
            title="BrianGPT"
            onMenuClick={() => setMenuCount((n) => n + 1)}
            menuButtonProps={{
              'aria-label': `Open menu (${menuCount} taps in this session)`,
            }}
          />
          <Sidebar.NewChatButton>New chat</Sidebar.NewChatButton>
          <Sidebar.NavSection sectionLabel="Projects" aria-label="Case studies">
            {PROJECTS.map((label) => (
              <Sidebar.NavItem
                key={label}
                active={active === label}
                compactIcon={<Globe color="orange" size={18} aria-hidden />}
                onClick={() => setActive(label)}
              >
                {label}
              </Sidebar.NavItem>
            ))}
          </Sidebar.NavSection>
        </Sidebar.Stack>
        <Sidebar.FooterSlot>
          <Sidebar.Profile name="Brian Munroe" roleLine="Product Designer" />
        </Sidebar.FooterSlot>
      </Sidebar>
      </div>
      <SidebarAnimationTuner />
    </div>
  );
}
