import * as React from 'react';
import Link from 'next/link';
import { Menu, Plus, DownChevron } from '@/components/icons';
import styles from './Sidebar.module.css';

/** Comfortable `Sidebar` (341:656); compact rail (`Side Bar` 3:78). */
export type SidebarDensity = 'comfortable' | 'compact';

const SidebarDensityContext = React.createContext<SidebarDensity>('comfortable');

export function useSidebarDensity(): SidebarDensity {
  return React.useContext(SidebarDensityContext);
}

function mergeClassNames(...parts: Array<string | undefined | false | null>) {
  return parts.filter(Boolean).join(' ');
}

/** Small diamond used inside the brand mark (Figma sparkle-style glyph, node 99:1325). */
function BrandGlyph(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width={16} height={16} viewBox="0 0 16 16" aria-hidden {...props}>
      <path
        fill="currentColor"
        d="M8 1.5 10.35 5.65 14.5 8l-4.15 2.35L8 14.5 5.65 10.35 1.5 8l4.15-2.35L8 1.5Z"
      />
    </svg>
  );
}

export type SidebarProps = React.HTMLAttributes<HTMLElement> & {
  /** Use `aside` (default) or `nav` when the whole column is primary navigation. */
  as?: 'aside' | 'nav';
  /**
   * `compact` = icon rail (`width: fit-content`, hugs controls); `comfortable` = 240px (`Sidebar` 341:656).
   * Width and padding animate on the root.
   */
  density?: SidebarDensity;
};

const SidebarRoot = React.forwardRef<HTMLElement, SidebarProps>(function Sidebar(
  { as: Comp = 'aside', className, children, density = 'comfortable', ...rest },
  ref
) {
  return (
    <SidebarDensityContext.Provider value={density}>
      {React.createElement(
        Comp,
        {
          ref,
          'data-density': density,
          className: mergeClassNames(styles.root, className),
          ...rest,
        },
        children
      )}
    </SidebarDensityContext.Provider>
  );
});

export type SidebarStackProps = React.HTMLAttributes<HTMLDivElement>;

const SidebarStack = React.forwardRef<HTMLDivElement, SidebarStackProps>(function SidebarStack(
  { className, children, ...rest },
  ref
) {
  return (
    <div ref={ref} className={mergeClassNames(styles.stack, className)} {...rest}>
      {children}
    </div>
  );
});

export type SidebarFooterSlotProps = React.HTMLAttributes<HTMLDivElement>;

const SidebarFooterSlot = React.forwardRef<HTMLDivElement, SidebarFooterSlotProps>(
  function SidebarFooterSlot({ className, children, ...rest }, ref) {
    return (
      <div ref={ref} className={mergeClassNames(styles.footerSlot, className)} {...rest}>
        {children}
      </div>
    );
  }
);

export type SidebarHeaderRowProps = {
  title: string;
  /** When set, the title becomes a link (e.g. `/` for home). */
  brandHref?: string;
  /** Extra props for the brand `Link` (e.g. `onClick` to reset client state when `href` is already active). */
  brandLinkProps?: Omit<React.ComponentProps<typeof Link>, 'href' | 'children'>;
  /** Mark shown in the orange circle (default: diamond glyph). */
  logo?: React.ReactNode;
  /** Figma homepage sidebar (334:449): title + menu only — no orange mark. */
  showBrandMark?: boolean;
  onMenuClick?: () => void;
  /** Optional menu button icon override (defaults to `Menu`). */
  menuIcon?: React.ReactNode;
  menuButtonProps?: Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'onClick'>;
};

function SidebarHeaderRow({
  title,
  brandHref,
  brandLinkProps,
  logo,
  showBrandMark = true,
  onMenuClick,
  menuIcon,
  menuButtonProps,
}: SidebarHeaderRowProps) {
  const { className: menuClass, 'aria-label': menuAriaLabel, ...menuRest } = menuButtonProps ?? {};

  const titleEl =
    brandHref != null && brandHref !== '' ? (
      <Link href={brandHref} className={styles.brandTitle} {...brandLinkProps}>
        {title}
      </Link>
    ) : (
      <p className={styles.brandTitle}>{title}</p>
    );

  return (
    <div className={styles.headerRow}>
      <div className={mergeClassNames(styles.brand, !showBrandMark && styles.brandTextOnly)}>
        {showBrandMark ? <span className={styles.logoMark}>{logo ?? <BrandGlyph />}</span> : null}
        {titleEl}
      </div>
      <button
        type="button"
        className={mergeClassNames(styles.menuButton, menuClass)}
        aria-label={menuAriaLabel ?? 'Toggle menu'}
        onClick={onMenuClick}
        {...menuRest}
      >
        {menuIcon ?? <Menu color="grey" size={16} />}
      </button>
    </div>
  );
}

export type SidebarNewChatButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'type' | 'children'
> & {
  children?: React.ReactNode;
};

const SidebarNewChatButton = React.forwardRef<HTMLButtonElement, SidebarNewChatButtonProps>(
  function SidebarNewChatButton({ children = 'New chat', className, ...rest }, ref) {
    return (
      <button ref={ref} type="button" className={mergeClassNames(styles.newChat, className)} {...rest}>
        <Plus color="orange" size={16} aria-hidden />
        <span className={styles.newChatLabel}>{children}</span>
      </button>
    );
  }
);

export type SidebarNavSectionProps = {
  'aria-label'?: string;
  sectionLabel: string;
  children: React.ReactNode;
  className?: string;
};

function SidebarNavSection({ 'aria-label': ariaLabel, sectionLabel, children, className }: SidebarNavSectionProps) {
  return (
    <nav className={mergeClassNames(styles.nav, className)} aria-label={ariaLabel ?? sectionLabel}>
      <p className={styles.navSectionLabel}>{sectionLabel}</p>
      <ul className={styles.navList}>{children}</ul>
    </nav>
  );
}

export type SidebarNavItemProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> & {
  active?: boolean;
  /** Reserved for potential icon-rail mode; not used by current collapse animation. */
  compactIcon?: React.ReactNode;
};

const SidebarNavItem = React.forwardRef<HTMLButtonElement, SidebarNavItemProps>(
  function SidebarNavItem({ active, className, children, ...rest }, ref) {

    return (
      <li className={styles.navItemWrap}>
        <button
          ref={ref}
          type="button"
          className={mergeClassNames(styles.navItem, active && styles.navItemActive, className)}
          aria-current={active ? 'page' : undefined}
          {...rest}
        >
          <span className={styles.navItemBody}>{children}</span>
        </button>
      </li>
    );
  }
);

export type SidebarProfileProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> & {
  name: string;
  roleLine: string;
  avatar?: React.ReactNode;
  showChevron?: boolean;
  /** When true, skip row hover background and default cursor (shell until menu returns). */
  disableRowHover?: boolean;
};

const SidebarProfile = React.forwardRef<HTMLButtonElement, SidebarProfileProps>(
  function SidebarProfile(
    { name, roleLine, avatar, showChevron = true, disableRowHover = false, className, ...rest },
    ref
  ) {
    const aria = `${name}, ${roleLine}`;

    return (
      <button
        ref={ref}
        type="button"
        className={mergeClassNames(styles.profile, disableRowHover && styles.profileNoRowHover, className)}
        aria-label={aria}
        {...rest}
      >
        <span className={styles.avatar}>{avatar}</span>
        <span className={styles.profileMeta}>
          <span className={styles.profileName}>{name}</span>
          <span className={styles.profileRole}>{roleLine}</span>
        </span>
        {showChevron ? (
          <span className={styles.chevron}>
            <DownChevron color="grey" size={16} aria-hidden />
          </span>
        ) : null}
      </button>
    );
  }
);

/** App sidebar primitives — Figma `Sidebar` 341:656 (BrianGPT file). */
export const Sidebar = Object.assign(SidebarRoot, {
  Stack: SidebarStack,
  FooterSlot: SidebarFooterSlot,
  HeaderRow: SidebarHeaderRow,
  NewChatButton: SidebarNewChatButton,
  NavSection: SidebarNavSection,
  NavItem: SidebarNavItem,
  Profile: SidebarProfile,
});
