import { notFound } from 'next/navigation';
import { WorkCaseShell } from '@/app/work/WorkCaseShell';
import { CaseStudyContent } from '@/app/work/CaseStudyContent';
import { CurioCaseStudy } from '@/app/work/curio/CurioCaseStudy';
import { SelectAiCaseStudy } from '@/app/work/selectai/SelectAiCaseStudy';
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
  const body =
    slug === 'curio' ? (
      <CurioCaseStudy study={study} />
    ) : slug === 'selectai' ? (
      <SelectAiCaseStudy study={study} />
    ) : (
      <CaseStudyContent study={study} />
    );

  return (
    <WorkCaseShell scaleBackground headerExtraGap={slug === 'selectai'}>
      {body}
    </WorkCaseShell>
  );
}