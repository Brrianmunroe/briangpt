export const CASE_STUDY_SLUGS = ['selectai', 'curio'] as const;

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
  selectai: {
    slug: 'selectai',
    variant: 'primary',
    title: 'SelexAI',
    subtitle: 'Tackling the Corporate Work Paradox',
    description:
      'SelexAI helps video editors cut interviews faster without losing creative control. As sole designer, I led end-to-end discovery, design, and development from research to MVP. User interviews surfaced what I call the "corporate work paradox": corporate projects pay the most but feel the least creatively fulfilling. Combined with post-production overhead, the result is procrastination and burnout. After mapping workflows, I uncovered three bottlenecks and scoped the MVP around the one editors ranked highest: cutting interview selects. My hypothesis was that AI could surface strong moments, letting editors move straight into crafting the narrative. Usability testing confirmed the prototype felt intuitive but exposed a key tension — editors feared losing details by delegating to AI. Rather than hiding AI\'s role, I built features that made its decisions visible and kept creators in control. In testing, early users estimated up to 30% time savings in post-production. Next would be to launch in beta and talk with users about time saved and quality of the AI cuts.',
    features: [
      'Scoped the MVP on the highest-ranked bottleneck: cutting interview selects from long-form interviews.',
      'Made AI decisions visible and kept editors in control after usability tests surfaced fear of losing detail.',
      'Estimated up to 30% post-production time savings in early testing; next step is beta launch and outcome validation.',
    ],
    panels: [
      {
        heading: 'Corporate work paradox',
        body: 'Interviews showed well-paid corporate work often felt the least creatively fulfilling, which — combined with post-production overhead — led to procrastination and burnout. That reframed the problem around reducing edit friction without stripping agency.',
      },
      {
        heading: 'Trust and transparency',
        body: 'Editors worried about handing judgment to AI. The product direction emphasized surfacing what the model was doing so creators could stay in the loop instead of hiding automation behind a black box.',
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
