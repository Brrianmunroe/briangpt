'use client';

import * as React from 'react';
import { Button } from '@/components/button';
import { syncApplicationInertState } from './work/case-study-navigation';

const CONSTRUCTION_GATE_MQ = '(max-width: 860px)';

export function ResponsiveConstructionGate() {
  const [dismissed, setDismissed] = React.useState(false);
  const continueButtonRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia(CONSTRUCTION_GATE_MQ);

    const syncGateState = () => {
      const blocking = mediaQuery.matches && !dismissed;
      if (blocking) document.body.dataset.responsiveConstructionGate = 'open';
      else delete document.body.dataset.responsiveConstructionGate;
      syncApplicationInertState();
      if (blocking) continueButtonRef.current?.focus();
    };

    syncGateState();
    mediaQuery.addEventListener('change', syncGateState);

    return () => {
      mediaQuery.removeEventListener('change', syncGateState);
      delete document.body.dataset.responsiveConstructionGate;
      syncApplicationInertState();
    };
  }, [dismissed]);

  const dismissGate = React.useCallback(() => {
    delete document.body.dataset.responsiveConstructionGate;
    syncApplicationInertState();
    setDismissed(true);
    window.requestAnimationFrame(() => {
      const focusTarget =
        document.querySelector<HTMLElement>('[data-case-study-close]') ??
        document.querySelector<HTMLElement>('.appBackground button, .appBackground a[href]');
      focusTarget?.focus({ preventScroll: true });
    });
  }, []);

  if (dismissed) return null;

  return (
    <aside
      className="responsiveConstructionGate"
      role="dialog"
      aria-modal="true"
      aria-labelledby="responsive-construction-title"
      aria-describedby="responsive-construction-description"
    >
      <div className="responsiveConstructionCard">
        <img
          className="responsiveConstructionAvatar"
          src="/avatars/brian-profile.png"
          alt=""
          width="56"
          height="56"
        />
        <div className="responsiveConstructionCopy">
          <h1 id="responsive-construction-title">
            The mobile experience is currently under construction.
          </h1>
          <p id="responsive-construction-description">
            Visit on a desktop for the best version.
          </p>
          <div className="responsiveConstructionActions">
            <Button
              ref={continueButtonRef}
              variant="primary"
              showIcon={false}
              onClick={dismissGate}
            >
              Continue anyway
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
}
