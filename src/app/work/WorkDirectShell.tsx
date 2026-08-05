'use client';

import { useState, type ReactNode } from 'react';
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
  const [closing, setClosing] = useState(false);
  const [modalOpen, setModalOpen] = useState(true);

  return (
    <>
      <div
        className={`${styles.directBackground}${closing ? ` ${styles.directBackgroundClosing}` : ''}`}
        inert={modalOpen}
      >
        <LandingPage initialSidebarDensity="compact" />
      </div>
      <WorkCaseShell
        initiallyVisible
        headerExtraGap={headerExtraGap}
        selectAiSurface={selectAiSurface}
        onCloseStart={() => setClosing(true)}
        onCloseComplete={() => setModalOpen(false)}
      >
        {children}
      </WorkCaseShell>
    </>
  );
}
