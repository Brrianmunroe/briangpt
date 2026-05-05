/**
 * Maps a Figma variable path (slashes, optional spaces) to the CSS custom property name
 * used in tokens.css — same rule as build.mjs / figma-variables.json.
 */
export function figmaPathToVarName(figmaPath: string): string {
  return (
    '--' +
    figmaPath
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/\//g, '-')
      .replace(/-+/g, '-')
  );
}

export function varNameToRef(name: string): string {
  return `var(${name.startsWith('--') ? name : `--${name}`})`;
}
