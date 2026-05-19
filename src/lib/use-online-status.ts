'use client';

import * as React from 'react';

export function useOnlineStatus(): boolean {
  const subscribe = React.useCallback((onStoreChange: () => void) => {
    if (typeof window === 'undefined') return () => {};
    window.addEventListener('online', onStoreChange);
    window.addEventListener('offline', onStoreChange);
    return () => {
      window.removeEventListener('online', onStoreChange);
      window.removeEventListener('offline', onStoreChange);
    };
  }, []);

  return React.useSyncExternalStore(
    subscribe,
    () => (typeof navigator !== 'undefined' ? navigator.onLine : true),
    () => true
  );
}
