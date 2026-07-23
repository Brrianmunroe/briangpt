'use client';

import * as React from 'react';
import { Button } from '@/components/button';

const CONSTRUCTION_GATE_MQ = '(max-width: 860px)';

export function ResponsiveConstructionGate() {
  const [dismissed, setDismissed] = React.useState(false);
  const continueButtonRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    const appBackground = document.querySelector<HTMLElement>('.appBackground');
    const mediaQuery = window.matchMedia(CONSTRUCTION_GATE_MQ);

    const syncGateState = () => {
      const blocking = mediaQuery.matches && !dismissed;
      if (appBackground) appBackground.inert = blocking;
      if (blocking) document.body.dataset.responsiveConstructionGate = 'open';
      else delete document.body.dataset.responsiveConstructionGate;
      if (blocking) continueButtonRef.current?.focus();
    };

    syncGateState();
    mediaQuery.addEventListener('change', syncGateState);

    return () => {
      mediaQuery.removeEventListener('change', syncGateState);
      if (appBackground) appBackground.inert = false;
      delete document.body.dataset.responsiveConstructionGate;
    };
  }, [dismissed]);

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
              onClick={() => setDismissed(true)}
            >
              Continue anyway
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
}
