import fs, { mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

/**
 * Token build — **edit `figma-variables.json` only**, then run this script.
 * Never hand-edit `tokens.css` output: unlisted variables disappear on the next build.
 */

const __dirname = dirname(fileURLToPath(import.meta.url));
const data = JSON.parse(fs.readFileSync(join(__dirname, 'figma-variables.json'), 'utf8'));
mkdirSync(join(__dirname, 'generated'), { recursive: true });

function formatPrimitiveRhs(type, value) {
  if (type === 'COLOR') return value;
  if (type === 'FLOAT') return `${value}px`;
  if (type === 'STRING') return JSON.stringify(value);
  return String(value);
}

function aliasRhs(entry) {
  if (entry.ref) return `var(${entry.ref})`;
  return formatPrimitiveRhs(entry.type, entry.value);
}

let css = `/**
 * BrianGPT design tokens — mirrors Figma variable collections:
 * 01 - Primitives → 02 - Alias → 03 - Mapped
 *
 * FLOAT tokens from Figma are authored as pixel numbers; rendered here with a px suffix.
 * Regenerate: node design-tokens/build.mjs
 */
:root {
`;

css += `  /* --- 01 - Primitives (${data.primitives.length}) --- */\n`;
for (const p of data.primitives) {
  css += `  ${p.var}: ${formatPrimitiveRhs(p.type, p.value)};\n`;
}

css += `\n  /* --- 02 - Alias (${data.alias.length}) --- */\n`;
for (const a of data.alias) {
  css += `  ${a.var}: ${aliasRhs(a)};\n`;
}

css += `\n  /* --- 03 - Mapped (${data.mapped.length}) --- */\n`;
for (const m of data.mapped) {
  if (m.ref && m.value !== undefined) {
    throw new Error(`mapped entry must use only one of ref or value: ${JSON.stringify(m)}`);
  }
  if (m.ref) {
    css += `  ${m.var}: var(${m.ref});\n`;
  } else if (m.value !== undefined) {
    css += `  ${m.var}: ${m.value};\n`;
  } else {
    throw new Error(`mapped entry needs ref or value: ${JSON.stringify(m)}`);
  }
}

css += `}\n`;
fs.writeFileSync(join(__dirname, 'tokens.css'), css);

const publicTokensDir = join(__dirname, '..', 'public', 'design-tokens');
mkdirSync(publicTokensDir, { recursive: true });
fs.writeFileSync(join(publicTokensDir, 'tokens.css'), css);

const ts = `/**
 * Auto-generated from figma-variables.json — run node design-tokens/build.mjs
 */
export const primitivePaths = ${JSON.stringify(Object.fromEntries(data.primitives.map((p) => [p.figma, p.var])), null, 2)} as const;

export const aliasPaths = ${JSON.stringify(Object.fromEntries(data.alias.map((a) => [a.figma, a.var])), null, 2)} as const;

export const mappedPaths = ${JSON.stringify(Object.fromEntries(data.mapped.map((m) => [m.figma, m.var])), null, 2)} as const;

export type PrimitivePath = keyof typeof primitivePaths;
export type AliasPath = keyof typeof aliasPaths;
export type MappedPath = keyof typeof mappedPaths;
`;

fs.writeFileSync(join(__dirname, 'generated', 'paths.ts'), ts);

console.log('Wrote tokens.css, public/design-tokens/tokens.css, and generated/paths.ts');
