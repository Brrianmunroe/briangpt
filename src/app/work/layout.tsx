import type { ReactNode } from 'react';
import { WorkCaseShell } from './WorkCaseShell';

export default function WorkLayout({ children }: { children: ReactNode }) {
  return <WorkCaseShell>{children}</WorkCaseShell>;
}
