export const CASE_STUDY_SLUGS = [
  'ai-chat-interface',
  'enterprise-design-system',
  'mobile-banking-app',
] as const;

export type CaseStudySlug = (typeof CASE_STUDY_SLUGS)[number];

export type CaseStudy = {
  slug: CaseStudySlug;
  variant: 'primary' | 'secondary';
  title: string;
  subtitle: string;
  description: string;
  features: readonly string[];
  panels: readonly { heading: string; body: string }[];
};

export const CASE_STUDIES = {
  'ai-chat-interface': {
    slug: 'ai-chat-interface',
    variant: 'primary',
    title: 'AI Chat Interface',
    subtitle: 'Modern chatbot UI with NLP',
    description:
      'A conversational surface tuned for clarity, speed, and trust — streaming replies, crisp hierarchy, and guardrails that keep the experience on-brand.',
    features: [
      'Streaming assistant responses with stop and retry affordances',
      'Composer and thread layout aligned to a strict design system',
      'Grounded answers with visible error and empty states',
    ],
    panels: [
      {
        heading: 'Conversation frame',
        body: 'The chat region scrolls independently while the composer stays pinned, mirroring the live BrianGPT layout.',
      },
      {
        heading: 'Input and chips',
        body: 'Starter prompts and follow-ups reduce cold-start friction; chips scroll with edge fades on smaller viewports.',
      },
    ],
  },
  'enterprise-design-system': {
    slug: 'enterprise-design-system',
    variant: 'secondary',
    title: 'Enterprise Design System',
    subtitle: 'Scalable component library for fintech products',
    description:
      'Tokens-first foundations, documented components, and accessibility built in so product teams ship consistently without reinventing basics.',
    features: [
      'Mapped tokens from Figma to CSS with repeatable automation',
      'Card, sidebar, and composer patterns shared across experiences',
      'Focus-visible and reduced-motion accessibility defaults',
    ],
    panels: [
      {
        heading: 'Token pipeline',
        body: 'Primitives roll up into semantic colors, spacing, and typography so theming and visual consistency stay mechanical.',
      },
      {
        heading: 'Composition',
        body: 'Layout primitives mirror design-language blocks, making handoff between design and engineering faster.',
      },
    ],
  },
  'mobile-banking-app': {
    slug: 'mobile-banking-app',
    variant: 'secondary',
    title: 'Mobile Banking App',
    subtitle: 'Award-winning mobile experience',
    description:
      'Motion, density, and progressive disclosure tuned for one-handed use so critical flows stay obvious while secondary actions stay reachable.',
    features: [
      'Adaptive density for balances, transactions, and alerts',
      'Biometric-first auth with clear recovery paths',
      'Real-time spend insights without overwhelming the home screen',
    ],
    panels: [
      {
        heading: 'Home and accounts',
        body: 'Balances lead; transfers and payees tuck behind primary actions to keep cognitive load low at first glance.',
      },
      {
        heading: 'Spending insights',
        body: 'Category breakdowns use consistent chart grammar and tap targets sized for thumbs on common device widths.',
      },
    ],
  },
} as const satisfies Record<CaseStudySlug, CaseStudy>;

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return CASE_STUDIES[slug as CaseStudySlug];
}

export function isCaseStudySlug(slug: string): slug is CaseStudySlug {
  return (CASE_STUDY_SLUGS as readonly string[]).includes(slug);
}

export const CASE_STUDY_LIST: readonly CaseStudy[] = CASE_STUDY_SLUGS.map(
  (slug) => CASE_STUDIES[slug],
);
