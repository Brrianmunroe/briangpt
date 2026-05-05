'use client';

import * as React from 'react';
import { Card } from '@/components/card';
import styles from './CardGalleryDemo.module.css';

export function CardGalleryDemo() {
  const [n, setN] = React.useState(0);

  return (
    <div className={styles.row}>
      <Card
        variant="primary"
        title="Card Title"
        subtitle={`Clicks: ${n}`}
        role="button"
        tabIndex={0}
        onClick={() => setN((c) => c + 1)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setN((c) => c + 1);
          }
        }}
      />
    </div>
  );
}
