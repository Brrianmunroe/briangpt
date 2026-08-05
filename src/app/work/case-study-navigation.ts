export const CASE_STUDY_NAVIGATION_SETTLED_EVENT = 'case-study-navigation-settled';
export const CASE_STUDY_TITLE_ID = 'case-study-title';

/** Keep independently rendered overlays from clearing each other's interaction isolation. */
export function syncApplicationInertState() {
  if (typeof document === 'undefined') return;
  const constructionGateOpen =
    document.body.dataset.responsiveConstructionGate === 'open';
  const appBackground = document.querySelector<HTMLElement>('.appBackground');
  if (appBackground) {
    appBackground.inert =
      document.body.dataset.caseModalState != null || constructionGateOpen;
  }
  document.querySelectorAll<HTMLElement>('[data-case-study-modal]').forEach((modal) => {
    modal.inert = constructionGateOpen;
  });
}
