import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CASE_STUDY_SLUGS, getCaseStudy, isCaseStudySlug } from '@/lib/case-studies';
import { CaseStudyContent } from '../CaseStudyContent';
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

  return (
    <WorkCaseShell>
      <CaseStudyContent study={study} />
    </WorkCaseShell>
  );
}
