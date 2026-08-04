import type { ReactNode } from 'react';
import { LandingPage } from '@/app/LandingPage';
import { WorkCaseShell } from './WorkCaseShell';
import styles from './work-shell.module.css';

export function WorkDirectShell({
  children,
  headerExtraGap = false,
  selectAiSurface = false,
}: {
  children: ReactNode;
  headerExtraGap?: boolean;
  selectAiSurface?: boolean;
}) {
  return (
    <>
      <div className={styles.directBackground}>
        <LandingPage initialSidebarDensity="compact" />
      </div>
      <WorkCaseShell
        initiallyVisible
        headerExtraGap={headerExtraGap}
        selectAiSurface={selectAiSurface}
      >
        {children}
      </WorkCaseShell>
    </>
  );
}
