function parseDuration(raw: string): number | null {
  const msMatch = raw.match(/^([\d.]+)\s*ms$/i);
  if (msMatch) return Math.max(0, Math.round(parseFloat(msMatch[1])));
  const sMatch = raw.match(/^([\d.]+)\s*s$/i);
  if (sMatch) return Math.max(0, Math.round(parseFloat(sMatch[1]) * 1000));
  return null;
}

export function parseWorkShellDurationMs(
  el: HTMLElement | null,
  cssVariable: string,
  fallbackMs: number,
): number {
  if (!el) return fallbackMs;
  if (typeof getComputedStyle !== 'function') return fallbackMs;
  let raw = '';
  try {
    raw = getComputedStyle(el).getPropertyValue(cssVariable).trim();
  } catch {
    return fallbackMs;
  }
  if (!raw) return fallbackMs;
  return parseDuration(raw) ?? fallbackMs;
}
