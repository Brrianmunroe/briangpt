'use client';

import * as React from 'react';
import { Button } from '@/components/button';
import styles from './GalleryInteractives.module.css';

/** Live checks for click handlers and native submit behavior. */
export function GalleryInteractives() {
  const [clicks, setClicks] = React.useState(0);
  const [submitCount, setSubmitCount] = React.useState(0);

  return (
    <div className={styles.wrap}>
      <div className={styles.block}>
        <p className={styles.label}>
          <code>onClick</code> (primary)
        </p>
        <Button variant="primary" onClick={() => setClicks((c) => c + 1)}>
          Clicks: {clicks}
        </Button>
      </div>
      <div className={styles.block}>
        <p className={styles.label}>
          <code>buttonType=&quot;submit&quot;</code> in a form (secondary)
        </p>
        <form
          className={styles.form}
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitCount((n) => n + 1);
          }}
        >
          <Button variant="secondary" buttonType="submit">
            Submit (demo)
          </Button>
        </form>
        <p className={styles.hint} role="status">
          Form submits blocked — count: {submitCount}
        </p>
      </div>
    </div>
  );
}
