import { notFound } from 'next/navigation';
import { WorkCaseShell } from '@/app/work/WorkCaseShell';
import { CaseStudyContent } from '@/app/work/CaseStudyContent';
import { CASE_STUDY_SLUGS, getCaseStudy, isCaseStudySlug } from '@/lib/case-studies';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return CASE_STUDY_SLUGS.map((slug) => ({ slug }));
}

export default async function InterceptedCaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  if (!isCaseStudySlug(slug)) notFound();
  const study = getCaseStudy(slug)!;
  return (
    <WorkCaseShell scaleBackground>
      <CaseStudyContent study={study} />
    </WorkCaseShell>
  );
}