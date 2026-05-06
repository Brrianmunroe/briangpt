import type { ReactNode } from 'react';

/**
 * Case study routes render `WorkCaseShell` inside each `page.tsx`.
 * This layout stays minimal so we never nest two shells (that broke layout + Figma capture).
 */
export default function WorkLayout({ children }: { children: ReactNode }) {
  return children;
}
