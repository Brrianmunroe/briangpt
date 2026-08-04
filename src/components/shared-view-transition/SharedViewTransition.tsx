'use client';

import * as React from 'react';

type SharedViewTransitionProps = {
  children: React.ReactNode;
  disabled?: boolean;
  name: string;
};

type ReactWithViewTransition = typeof React & {
  unstable_ViewTransition?: React.ComponentType<SharedViewTransitionProps>;
};

const ViewTransition = (React as ReactWithViewTransition).unstable_ViewTransition;

/** Uses React's transition boundary when enabled, with a safe stable-React fallback. */
export function SharedViewTransition({
  children,
  disabled = false,
  name,
}: SharedViewTransitionProps) {
  if (disabled || !ViewTransition) return <>{children}</>;
  return <ViewTransition name={name}>{children}</ViewTransition>;
}
