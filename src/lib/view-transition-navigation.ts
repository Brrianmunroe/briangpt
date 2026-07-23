type ViewTransitionHandle = {
  finished: Promise<void>;
};

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => Promise<void> | void) => ViewTransitionHandle;
};

let navigationInProgress = false;

function waitForDestination(selector: string): Promise<void> {
  return new Promise((resolve) => {
    let settled = false;
    let timeoutId = 0;

    const finish = () => {
      if (settled) return;
      settled = true;
      observer.disconnect();
      window.clearTimeout(timeoutId);
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
    };

    const observer = new MutationObserver(() => {
      if (document.querySelector(selector)) finish();
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });
    timeoutId = window.setTimeout(finish, 2000);
  });
}

/**
 * Keeps same-document route changes inside one deterministic view transition.
 * Waiting for the destination marker prevents Next's intermediate loading state
 * from becoming the transition's new snapshot.
 */
export function navigateWithViewTransition(
  navigate: () => void,
  destinationSelector: string
): void {
  if (navigationInProgress) return;

  const transitionDocument = document as ViewTransitionDocument;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!transitionDocument.startViewTransition || reduceMotion) {
    navigate();
    return;
  }

  navigationInProgress = true;
  const destinationReady = waitForDestination(destinationSelector);
  try {
    const transition = transitionDocument.startViewTransition(async () => {
      navigate();
      await destinationReady;
    });

    void transition.finished.catch(() => {}).finally(() => {
      navigationInProgress = false;
    });
  } catch {
    navigationInProgress = false;
    navigate();
  }
}
