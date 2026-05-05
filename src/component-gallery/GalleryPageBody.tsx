import * as React from 'react';
import { Button, type ButtonVariant } from '@/components/button';
import { Links } from '@/components/links';
import { NameTag } from '@/components/name-tag';
import { ChatInput } from '@/components/chat-input';
import { ChatInputGalleryDemo } from '@/component-gallery/ChatInputGalleryDemo';
import { PromptChipGalleryDemo } from '@/component-gallery/PromptChipGalleryDemo';
import { PromptChip } from '@/components/prompt-chip';
import { SpeechBubble } from '@/components/speech-bubble';
import { Card } from '@/components/card';
import { CardGalleryDemo } from '@/component-gallery/CardGalleryDemo';
import { SidebarGalleryDemo } from '@/component-gallery/SidebarGalleryDemo';
import { IconsGrid } from '@/component-gallery/IconsGrid';
import { GalleryInteractives } from '@/component-gallery/GalleryInteractives';
import styles from './GalleryPageBody.module.css';

const VARIANTS: ButtonVariant[] = ['primary', 'secondary', 'ghost'];

export type GalleryPageBodyProps = {
  /** Prefix for in-page anchors (avoid duplicate ids when embedded on `/`). */
  idPrefix?: string;
  /** When false, omit the icon matrix (e.g. home page already shows `IconsGrid`). */
  includeIcons?: boolean;
  /** Standalone page vs embedded under the home layout */
  layout?: 'standalone' | 'embedded';
  /** Top-right navigation slot */
  navSlot: React.ReactNode;
  heading: string;
  /** If true, show a short note about alternate URLs (standalone gallery pages). */
  showRouteFallbackNote?: boolean;
};

function anchor(id: string, prefix: string) {
  return prefix ? `${prefix}${id}` : id;
}

export function GalleryPageBody({
  idPrefix = '',
  includeIcons = true,
  layout = 'standalone',
  navSlot,
  heading,
  showRouteFallbackNote = false,
}: GalleryPageBodyProps) {
  const p = (id: string) => anchor(id, idPrefix);
  const mainClass = layout === 'embedded' ? styles.mainEmbedded : styles.main;

  return (
    <main className={mainClass}>
      <header className={styles.header}>
        <div className={styles.headerRow}>
          <h1 className={styles.title}>{heading}</h1>
          {navSlot}
        </div>
        {showRouteFallbackNote ? (
          <p className={styles.fallbackNote}>
            If <code>/gallery</code> 404s in your environment, use the short URL{' '}
            <a href="/g" style={{ color: 'var(--color-orange-400)', fontWeight: 600 }}>
              /g
            </a>{' '}
            or open this same content on the <a href="/">home page</a> (scroll to &ldquo;Live
            components&rdquo;).
          </p>
        ) : null}
        <p className={styles.intro}>
          Exercise each control: hover, press, and <kbd>Tab</kbd> for focus rings.
          {includeIcons ? ' Icons mirror the matrix on the home page.' : ' Icons are in the section above.'}
        </p>
        <nav className={styles.toc} aria-label="On this page">
          <a className={styles.tocLink} href={`#${p('buttons')}`}>
            Buttons
          </a>
          <a className={styles.tocLink} href={`#${p('interact')}`}>
            Events &amp; forms
          </a>
          <a className={styles.tocLink} href={`#${p('links')}`}>
            Links
          </a>
          <a className={styles.tocLink} href={`#${p('name-tag')}`}>
            Name tag
          </a>
          <a className={styles.tocLink} href={`#${p('chat-input')}`}>
            Chat input
          </a>
          <a className={styles.tocLink} href={`#${p('prompt-chip')}`}>
            Prompt chip
          </a>
          <a className={styles.tocLink} href={`#${p('speech-bubble')}`}>
            Speech bubble
          </a>
          <a className={styles.tocLink} href={`#${p('card')}`}>
            Card
          </a>
          <a className={styles.tocLink} href={`#${p('sidebar')}`}>
            Sidebar
          </a>
          {includeIcons ? (
            <a className={styles.tocLink} href={`#${p('icons')}`}>
              Icons
            </a>
          ) : (
            <a className={styles.tocLink} href="#gallery-icons-jump">
              Icons (above)
            </a>
          )}
        </nav>
      </header>

      <section id={p('buttons')} className={styles.panel} aria-labelledby={p('buttons-heading')}>
        <h2 id={p('buttons-heading')} className={styles.h2}>
          Button
        </h2>
        <p className={styles.note}>
          From <code>@/components/button</code>. <code>variant</code> matches Figma{' '}
          <code>Type</code>. Visual states use tokens + <code>:hover</code>, <code>:active</code>,{' '}
          <code>:disabled</code>, <code>:focus-visible</code>.
        </p>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col" className={styles.thFirst}>
                  Scenario
                </th>
                {VARIANTS.map((v) => (
                  <th key={v} scope="col" className={styles.th}>
                    {v}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row" className={styles.rowHead}>
                  Interactive
                </th>
                {VARIANTS.map((v) => (
                  <td key={v} className={styles.td}>
                    <Button variant={v} aria-label={`${v} interactive sample`}>
                      Button
                    </Button>
                  </td>
                ))}
              </tr>
              <tr>
                <th scope="row" className={styles.rowHead}>
                  Disabled
                </th>
                {VARIANTS.map((v) => (
                  <td key={v} className={styles.td}>
                    <Button variant={v} disabled aria-label={`${v} disabled sample`}>
                      Button
                    </Button>
                  </td>
                ))}
              </tr>
              <tr>
                <th scope="row" className={styles.rowHead}>
                  No icon
                </th>
                {VARIANTS.map((v) => (
                  <td key={v} className={styles.td}>
                    <Button variant={v} showIcon={false} aria-label={`${v} text only sample`}>
                      Label
                    </Button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section id={p('interact')} className={styles.panel} aria-labelledby={p('interact-heading')}>
        <h2 id={p('interact-heading')} className={styles.h2}>
          Events &amp; forms
        </h2>
        <p className={styles.note}>
          Verifies <code>onClick</code> and <code>buttonType=&quot;submit&quot;</code> through the
          shared <code>Button</code> component.
        </p>
        <GalleryInteractives />
      </section>

      <section id={p('links')} className={styles.panel} aria-labelledby={p('links-heading')}>
        <h2 id={p('links-heading')} className={styles.h2}>
          Links
        </h2>
        <p className={styles.note}>
          From <code>@/components/links</code>. Matches Figma symbol <code>Links</code> (node{' '}
          <code>145:707</code>) — pill bar with ghost icon hits; icons use the <code>grey</code>{' '}
          variant and <code>--color-icon-surface-grey</code>.
        </p>
        <Links
          linkedinHref="https://www.linkedin.com/"
          githubHref="https://github.com/"
          mailHref="mailto:hello@example.com"
        />
      </section>

      <section id={p('name-tag')} className={styles.panel} aria-labelledby={p('name-tag-heading')}>
        <h2 id={p('name-tag-heading')} className={styles.h2}>
          Name tag
        </h2>
        <p className={styles.note}>
          From <code>@/components/name-tag</code>. Matches Figma <code>Name Tag</code> (node{' '}
          <code>155:341</code>) — case-study secondary pill, label typography, and CSS “today” ring
          (no raster assets).
        </p>
        <div className={styles.nameTagRow}>
          <NameTag />
          <NameTag>Custom label · one line</NameTag>
        </div>
      </section>

      <section id={p('chat-input')} className={styles.panel} aria-labelledby={p('chat-input-heading')}>
        <h2 id={p('chat-input-heading')} className={styles.h2}>
          Chat input
        </h2>
        <p className={styles.note}>
          From <code>@/components/chat-input</code>. Matches Figma <code>chat-input</code> (frame{' '}
          <code>132:181</code>) — surface, stroke, and send/stop chrome use mapped tokens;{' '}
          <code>previewState</code> pins each static variant below.
        </p>
        <div className={styles.chatInputPreviews} aria-label="Figma state previews">
          <ChatInput previewState="default" />
          <ChatInput previewState="active" />
          <ChatInput previewState="typing" />
          <ChatInput previewState="sent" />
          <ChatInput previewState="followUp" />
        </div>
        <h3 className={styles.h3}>Interactive</h3>
        <p className={styles.note}>
          Submit clears the field and toggles streaming; use <strong>Stop</strong> to return.
        </p>
        <ChatInputGalleryDemo />
      </section>

      <section id={p('prompt-chip')} className={styles.panel} aria-labelledby={p('prompt-chip-heading')}>
        <h2 id={p('prompt-chip-heading')} className={styles.h2}>
          Prompt chip
        </h2>
        <p className={styles.note}>
          From <code>@/components/prompt-chip</code>. Matches Figma <code>prompt-chip</code> (frame{' '}
          <code>141:352</code>) — mapped <code>--color-prompt-chip-*</code> tokens, label typography, default{' '}
          <code>Globe</code> icon. <code>previewState</code> pins static variants; live chip uses pseudo states.
        </p>
        <div className={styles.promptChipPreviews} aria-label="Figma state previews">
          <PromptChip previewState="default">prompt chip</PromptChip>
          <PromptChip previewState="hover">prompt chip</PromptChip>
          <PromptChip previewState="pressed">prompt chip</PromptChip>
          <PromptChip previewState="disabled">prompt chip</PromptChip>
          <PromptChip previewState="focused">prompt chip</PromptChip>
        </div>
        <h3 className={styles.h3}>Interactive</h3>
        <PromptChipGalleryDemo />
      </section>

      <section id={p('speech-bubble')} className={styles.panel} aria-labelledby={p('speech-bubble-heading')}>
        <h2 id={p('speech-bubble-heading')} className={styles.h2}>
          Speech bubble
        </h2>
        <p className={styles.note}>
          From <code>@/components/speech-bubble</code>. Matches Figma <code>speech-bubble</code> (frame{' '}
          <code>160:1375</code>) — <code>Type=User</code> (<code>160:1374</code>) uses{' '}
          <code>--color-neutral-200</code> + <code>--color-neutral-500</code> stroke; <code>Type=Chatbot</code> (
          <code>160:1376</code>) is transparent with no horizontal padding. Corner radius <code>16px</code> via{' '}
          <code>--spacing-md</code>; label typography + <code>--color-text-fill-primary</code>.
        </p>
        <div className={styles.speechBubbleStack} aria-label="Speech bubble examples">
          <SpeechBubble variant="user">User conversation bubble</SpeechBubble>
          <SpeechBubble variant="chatbot">Chatbot conversation bubble</SpeechBubble>
          <SpeechBubble variant="user" nowrap>
            Short label · nowrap (Figma-style single line)
          </SpeechBubble>
          <SpeechBubble variant="user">
            Longer assistant reply: wrapping is enabled by default so multi-sentence content stays readable inside
            the bubble without breaking the layout.
          </SpeechBubble>
        </div>
      </section>

      <section id={p('card')} className={styles.panel} aria-labelledby={p('card-heading')}>
        <h2 id={p('card-heading')} className={styles.h2}>
          Card
        </h2>
        <p className={styles.note}>
          From <code>@/components/card</code>. Matches Figma <code>card</code> (frame <code>155:219</code>) —{' '}
          <code>Type=Primary</code> / <code>Type=Secondary</code> with hover, pressed, focus-visible, and disabled
          states driven by <code>--color-case-study-card-*</code> tokens; layout and typography follow nodes{' '}
          <code>155:218</code> and <code>155:217</code>.
        </p>
        <div className={styles.cardPreviews} aria-label="Card variants">
          <Card variant="primary" title="Card Title" subtitle="Card Subtitle" />
          <Card variant="secondary" title="Card Title" subtitle="Card Subtitle" />
          <Card variant="primary" title="Card Title" subtitle="Disabled" disabled />
          <Card variant="secondary" title="Card Title" subtitle="Disabled" disabled />
        </div>
        <h3 className={styles.h3}>Interactive</h3>
        <p className={styles.note}>
          Primary card with <code>role=&quot;button&quot;</code> — click or press Enter / Space to increment.
        </p>
        <CardGalleryDemo />
      </section>

      <section id={p('sidebar')} className={styles.panel} aria-labelledby={p('sidebar-heading')}>
        <h2 id={p('sidebar-heading')} className={styles.h2}>
          Sidebar
        </h2>
        <p className={styles.note}>
          From <code>@/components/sidebar</code>. Matches the high-fidelity wireframe <code>Sidebar</code> (
          <code>99:1321</code>) — 240px column, brand row, <code>New chat</code> pill, projects list, and profile
          footer. Pass <code>density=&quot;compact&quot;</code> for the 91px icon rail from exploration{' '}
          <code>Side Bar</code> (<code>3:78</code>); width and padding animate on the root. Wireframe-only colors
          live as <code>--sidebar-*</code> in the module; accents align with <code>--color-orange-400</code> and
          shared typography tokens.
        </p>
        <SidebarGalleryDemo />
      </section>

      {includeIcons ? (
        <div id={p('icons')} className={styles.iconsBlock}>
          <IconsGrid showJumpNav />
        </div>
      ) : null}
    </main>
  );
}
