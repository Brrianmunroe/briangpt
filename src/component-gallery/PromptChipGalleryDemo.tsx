'use client';

import * as React from 'react';
import { PromptChip } from '@/components/prompt-chip';
import styles from './PromptChipGalleryDemo.module.css';

export function PromptChipGalleryDemo() {
  const [clicks, setClicks] = React.useState(0);

  return (
    <div className={styles.row}>
      <PromptChip onClick={() => setClicks((c) => c + 1)} aria-label="Demo prompt chip">
        live chip · {clicks}
      </PromptChip>
      <PromptChip showIcon={false}>no icon</PromptChip>
      <PromptChip disabled>disabled</PromptChip>
    </div>
  );
}
