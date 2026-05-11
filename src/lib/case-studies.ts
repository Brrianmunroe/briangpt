export const CASE_STUDY_SLUGS = ['curio', 'ai-chat-interface'] as const;

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
  curio: {
    slug: 'curio',
    variant: 'secondary',
    title: 'Curio',
    subtitle: 'Conversational AI built for retention',
    description:
      'Curio is a concept chatbot feature that helps users build a hyper-personalized Spotify library faster. When Spotify set a goal of adding 10M MAUs in a quarter, I explored whether growth could come from converting users on competing platforms. I surveyed 23 users and 70% said they would never consider switching. Interviews with Spotify and Apple Music users revealed why: users were deeply satisfied. Their libraries felt personal, recommendations were dialed, and both reinforced a strong sense of investment. An import tool could remove friction, but without intent to switch, there was no real opportunity. The real opportunity was accelerating personalization for brand new users. Operating on this new hypothesis, I tested two concepts, Chat and Curate. Chat, a playlist building chatbot, performed stronger in usability testing. Curate was shelved while Chat was integrated into onboarding, aiming to help users build one or more personalized playlist before signing up. Although this carries potential risks, I would monitor for dips in activation rates and I would track 7-day and 30-day retention compared to the standard sign up flow to validate success.',
    features: [
      'Survey (n = 23): 70% would not consider switching — pivoted from an import hypothesis to accelerating personalization for new users.',
      'Shipped two concepts to usability: Chat (playlist-building chatbot) vs Curate; Chat won, Curate shelved, Chat integrated into onboarding.',
      'Aim for one or more personalized playlists before signup; plan to compare activation and 7- / 30-day retention against the standard flow.',
    ],
    panels: [
      {
        heading: 'Research and pivot',
        body: 'Interviews showed libraries and recommendations already felt dialed in — high satisfaction and emotional investment. Without switch intent, the leverage point became helping brand-new users reach that "invested" state faster, not dragging libraries over from competitors.',
      },
      {
        heading: 'Chat vs Curate',
        body: 'In a five-participant study, Chat averaged far fewer errors and faster task time than Curate, with higher completion; most participants preferred Chat. That evidence backed prioritizing Chat in onboarding while monitoring activation and retention at 7 and 30 days versus control.',
      },
    ],
  },
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
