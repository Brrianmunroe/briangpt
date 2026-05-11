import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CASE_STUDY_SLUGS, getCaseStudy, isCaseStudySlug } from '@/lib/case-studies';
import { CaseStudyContent } from '../CaseStudyContent';
import { CurioCaseStudy } from '../curio/CurioCaseStudy';
import { SelectAiCaseStudy } from '../selectai/SelectAiCaseStudy';
import { WorkCaseShell } from '../WorkCaseShell';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return CASE_STUDY_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) {
    return { title: 'Case study — BrianGPT' };
  }
  return {
    title: `${study.title} — BrianGPT`,
    description: study.description,
  };
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  if (!isCaseStudySlug(slug)) notFound();
  const study = getCaseStudy(slug)!;
  const body =
    slug === 'curio' ? (
      <CurioCaseStudy study={study} />
    ) : slug === 'selectai' ? (
      <SelectAiCaseStudy study={study} />
    ) : (
      <CaseStudyContent study={study} />
    );

  return (
    <WorkCaseShell headerExtraGap={slug === 'selectai'}>{body}</WorkCaseShell>
  );
}
