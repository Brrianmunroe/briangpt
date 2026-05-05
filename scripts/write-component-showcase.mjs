/**
 * Writes public/component-showcase.html from the same path data as the React icons.
 * Run: node scripts/write-component-showcase.mjs
 */
import fs from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const ICONS = [
  {
    title: 'Up arrow',
    figma: 'icons / up-arrow',
    path: 'M4.66662 9.99984 L4.66662 2.27589 L1.13797 5.80453 C0.877621 6.06488 0.455612 6.06488 0.195262 5.80453 C-0.0650874 5.54418 -0.0650874 5.12217 0.195262 4.86182 L4.86193 0.195156 L4.91271 0.149583 C5.17456 -0.0639836 5.56056 -0.0489211 5.80464 0.195156 L10.4713 4.86182 C10.7317 5.12217 10.7317 5.54418 10.4713 5.80453 C10.211 6.06488 9.78895 6.06488 9.5286 5.80453 L5.99995 2.27589 L5.99995 9.99984 C5.99995 10.368 5.70147 10.6665 5.33328 10.6665 C4.96509 10.6665 4.66662 10.368 4.66662 9.99984 Z',
    fillRule: null,
  },
  {
    title: 'Stop',
    figma: 'icons / stop',
    path: 'M13.3333 11.3333 C13.3333 12.4379 12.4379 13.3333 11.3333 13.3333 L2 13.3333 C0.895431 13.3333 0 12.4379 0 11.3333 L0 2 C0 0.895431 0.895431 0 2 0 L11.3333 0 C12.4379 0 13.3333 0.895431 13.3333 2 L13.3333 11.3333 Z',
    fillRule: null,
  },
  {
    title: 'Globe',
    figma: 'icons / globe',
    path: 'M7.33333 0 C11.3834 0 14.6667 3.28325 14.6667 7.33333 C14.6667 11.3834 11.3834 14.6667 7.33333 14.6667 C3.28325 14.6667 0 11.3834 0 7.33333 C0 3.28325 3.28325 0 7.33333 0 Z M1.37109 8 C1.64499 10.4773 3.42631 12.4987 5.778 13.1283 C4.7502 11.6109 4.14111 9.84119 4.02214 8 L1.37109 8 Z M10.6445 8 C10.5255 9.84132 9.91594 11.6108 8.88802 13.1283 C11.24 12.4988 13.0217 10.4775 13.2956 8 L10.6445 8 Z M5.35807 8 C5.49361 9.82549 6.18354 11.5659 7.33333 12.9889 C8.48313 11.5659 9.17306 9.82549 9.30859 8 L5.35807 8 Z M8.88802 1.53776 C9.91613 3.05533 10.5255 4.82517 10.6445 6.66667 L13.2956 6.66667 C13.0216 4.18914 11.2401 2.16713 8.88802 1.53776 Z M7.33333 1.67708 C6.18335 3.10018 5.49362 4.84101 5.35807 6.66667 L9.30859 6.66667 C9.17305 4.84101 8.48332 3.10018 7.33333 1.67708 Z M5.778 1.53776 C3.42622 2.16731 1.645 4.18935 1.37109 6.66667 L4.02214 6.66667 C4.14113 4.82529 4.75001 3.05526 5.778 1.53776 Z',
    fillRule: 'nonzero',
  },
  {
    title: 'Down chevron',
    figma: 'icons / down-chevron',
    path: 'M8.19526 0.195262 C8.45561 -0.0650874 8.87762 -0.0650874 9.13797 0.195262 C9.39832 0.455612 9.39832 0.877621 9.13797 1.13797 L5.13797 5.13797 C4.87762 5.39832 4.45561 5.39832 4.19526 5.13797 L0.195262 1.13797 C-0.0650874 0.877621 -0.0650874 0.455612 0.195262 0.195262 C0.455612 -0.0650874 0.877621 -0.0650874 1.13797 0.195262 L4.66662 3.72391 L8.19526 0.195262 Z',
    fillRule: null,
  },
  {
    title: 'Plus',
    figma: 'icons / plus',
    path: 'M4.66667 10 L4.66667 6 L0.666667 6 C0.298477 6 0 5.70152 0 5.33333 C0 4.96514 0.298477 4.66667 0.666667 4.66667 L4.66667 4.66667 L4.66667 0.666667 C4.66667 0.298477 4.96514 0 5.33333 0 C5.70152 0 6 0.298477 6 0.666667 L6 4.66667 L10 4.66667 C10.3682 4.66667 10.6667 4.96514 10.6667 5.33333 C10.6667 5.70152 10.3682 6 10 6 L6 6 L6 10 C6 10.3682 5.70152 10.6667 5.33333 10.6667 C4.96514 10.6667 4.66667 10.3682 4.66667 10 Z',
    fillRule: null,
  },
  {
    title: 'Menu',
    figma: 'icons / menu',
    path: 'M12 2 C12 1.63181 11.7015 1.33333 11.3333 1.33333 L2 1.33333 C1.63181 1.33333 1.33333 1.63181 1.33333 2 L1.33333 11.3333 C1.33333 11.7015 1.63181 12 2 12 L11.3333 12 C11.7015 12 12 11.7015 12 11.3333 L12 2 Z M10 8.66667 C10.3682 8.66667 10.6667 8.96514 10.6667 9.33333 C10.6667 9.70152 10.3682 10 10 10 L3.33333 10 C2.96514 10 2.66667 9.70152 2.66667 9.33333 C2.66667 8.96514 2.96514 8.66667 3.33333 8.66667 L10 8.66667 Z M10 6 C10.3682 6 10.6667 6.29848 10.6667 6.66667 C10.6667 7.03486 10.3682 7.33333 10 7.33333 L3.33333 7.33333 C2.96514 7.33333 2.66667 7.03486 2.66667 6.66667 C2.66667 6.29848 2.96514 6 3.33333 6 L10 6 Z M10 3.33333 C10.3682 3.33333 10.6667 3.63181 10.6667 4 C10.6667 4.36819 10.3682 4.66667 10 4.66667 L3.33333 4.66667 C2.96514 4.66667 2.66667 4.36819 2.66667 4 C2.66667 3.63181 2.96514 3.33333 3.33333 3.33333 L10 3.33333 Z M13.3333 11.3333 C13.3333 12.4379 12.4379 13.3333 11.3333 13.3333 L2 13.3333 C0.895431 13.3333 0 12.4379 0 11.3333 L0 2 C0 0.89543 0.89543 0 2 0 L11.3333 0 C12.4379 0 13.3333 0.895431 13.3333 2 L13.3333 11.3333 Z',
    fillRule: 'nonzero',
  },
];

function readGithubPath() {
  const p = join(root, 'src/components/icons/Github.tsx');
  const s = fs.readFileSync(p, 'utf8');
  const m = s.match(/const GITHUB_PATH =\s*\n\s*'([^']+)'/);
  if (!m) throw new Error('GITHUB_PATH not found');
  return m[1];
}

function readLinkedinPath() {
  const p = join(root, 'src/components/icons/Linkedin.tsx');
  const s = fs.readFileSync(p, 'utf8');
  const m = s.match(/const LINKEDIN_PATH =\s*\n\s*'([^']+)'/);
  if (!m) throw new Error('LINKEDIN_PATH not found');
  return m[1];
}

function readMailPath() {
  const p = join(root, 'src/components/icons/Mail.tsx');
  const s = fs.readFileSync(p, 'utf8');
  const m = s.match(/const MAIL_PATH =\s*\n\s*'([^']+)'/);
  if (!m) throw new Error('MAIL_PATH not found');
  return m[1];
}

function readArrowNePath() {
  const p = join(root, 'src/components/icons/ArrowNe.tsx');
  const s = fs.readFileSync(p, 'utf8');
  const m = s.match(/const ARROW_NE_PATH =\s*\n\s*'([^']+)'/);
  if (!m) throw new Error('ARROW_NE_PATH not found');
  return m[1];
}

ICONS.push(
  { title: 'GitHub', figma: 'icons / github', path: readGithubPath(), fillRule: 'nonzero' },
  { title: 'LinkedIn', figma: 'icons / linkedin', path: readLinkedinPath(), fillRule: 'nonzero' },
  { title: 'Mail', figma: 'icons / mail', path: readMailPath(), fillRule: 'nonzero' },
  { title: 'Arrow NE', figma: 'icons / Arrow-NE', path: readArrowNePath(), fillRule: null }
);

const fills = [
  { key: 'black', var: 'var(--color-icon-surface-black)' },
  { key: 'orange', var: 'var(--color-icon-surface-orange)' },
  { key: 'grey', var: 'var(--color-icon-surface-grey)' },
];

function svgPath(d, fill, fillRule, size, className) {
  const fr = fillRule ? ` fill-rule="${fillRule}"` : '';
  return `<svg class="${className}" width="${size}" height="${size}" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="${d}" fill="${fill}"${fr} /></svg>`;
}

function buttonRow(variant, label, disabled, noIcon) {
  const cls = `c-btn c-btn--${variant}${noIcon ? ' c-btn--no-icon' : ''}`;
  const dis = disabled ? ' disabled' : '';
  const icon = noIcon
    ? '<span class="c-btn__icon"></span>'
    : svgPath(
        'M4.66662 9.99984 L4.66662 2.27589 L1.13797 5.80453 C0.877621 6.06488 0.455612 6.06488 0.195262 5.80453 C-0.0650874 5.54418 -0.0650874 5.12217 0.195262 4.86182 L4.86193 0.195156 L4.91271 0.149583 C5.17456 -0.0639836 5.56056 -0.0489211 5.80464 0.195156 L10.4713 4.86182 C10.7317 5.12217 10.7317 5.54418 10.4713 5.80453 C10.211 6.06488 9.78895 6.06488 9.5286 5.80453 L5.99995 2.27589 L5.99995 9.99984 C5.99995 10.368 5.70147 10.6665 5.33328 10.6665 C4.96509 10.6665 4.66662 10.368 4.66662 9.99984 Z',
        'var(--button-icon-fill)',
        null,
        16,
        'c-btn__icon'
      );
  return `<button type="button" class="${cls}"${dis}>${icon}<span>${label}</span></button>`;
}

function buttonIconOnly(variant, disabled) {
  const cls = `c-btn c-btn--${variant} c-btn--icon-only`;
  const dis = disabled ? ' disabled' : '';
  const icon = svgPath(
    'M4.66662 9.99984 L4.66662 2.27589 L1.13797 5.80453 C0.877621 6.06488 0.455612 6.06488 0.195262 5.80453 C-0.0650874 5.54418 -0.0650874 5.12217 0.195262 4.86182 L4.86193 0.195156 L4.91271 0.149583 C5.17456 -0.0639836 5.56056 -0.0489211 5.80464 0.195156 L10.4713 4.86182 C10.7317 5.12217 10.7317 5.54418 10.4713 5.80453 C10.211 6.06488 9.78895 6.06488 9.5286 5.80453 L5.99995 2.27589 L5.99995 9.99984 C5.99995 10.368 5.70147 10.6665 5.33328 10.6665 C4.96509 10.6665 4.66662 10.368 4.66662 9.99984 Z',
    'var(--button-icon-fill)',
    null,
    16,
    'c-btn__icon'
  );
  const label = `${variant} icon-only sample`;
  return `<button type="button" class="${cls}" aria-label="${label}"${dis}>${icon}</button>`;
}

const iconCards = ICONS.map(
  (ic) => `
    <article class="icon-card">
      <h3>${ic.title}</h3>
      <p class="meta"><code>${ic.figma}</code></p>
      <div class="row">
        ${fills
          .map(
            (f) => `
        <div class="cell">
          ${svgPath(ic.path, f.var, ic.fillRule, 24, 'showcase-icon')}
          <code>${f.key}</code>
        </div>`
          )
          .join('')}
      </div>
    </article>`
).join('');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>BrianGPT — component showcase (static)</title>
  <link rel="stylesheet" href="design-tokens/tokens.css" />
  <link rel="stylesheet" href="component-showcase.css" />
</head>
<body>
  <h1>Component showcase (static HTML)</h1>
  <p class="lead">
    Open this file from disk (<code>file://</code>) or via Next: run <code>npm run dev</code> and open <code>/component-showcase.html</code> on the host and port printed in the terminal (if port 3000 is already in use, Next picks another, e.g. 3002).
    Tokens load from <code>design-tokens/tokens.css</code> (copy kept in <code>public/</code>; regenerate with <code>npm run build:tokens</code>).
    React sources: <code>src/components/button</code>, <code>src/components/icons</code>.
  </p>

  <h2 id="buttons">Buttons</h2>
  <p class="lead">Hover, press, Tab for focus. Same CSS variables as the Next <code>Button</code> component.</p>
  <div class="table-wrap">
    <table>
      <thead>
        <tr>
          <th class="th-first" scope="col">Scenario</th>
          <th class="th-variant" scope="col">primary</th>
          <th class="th-variant" scope="col">secondary</th>
          <th class="th-variant" scope="col">ghost</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th class="row-head" scope="row">Interactive</th>
          <td>${buttonRow('primary', 'Button', false, false)}</td>
          <td>${buttonRow('secondary', 'Button', false, false)}</td>
          <td>${buttonRow('ghost', 'Button', false, false)}</td>
        </tr>
        <tr>
          <th class="row-head" scope="row">Disabled</th>
          <td>${buttonRow('primary', 'Button', true, false)}</td>
          <td>${buttonRow('secondary', 'Button', true, false)}</td>
          <td>${buttonRow('ghost', 'Button', true, false)}</td>
        </tr>
        <tr>
          <th class="row-head" scope="row">No icon</th>
          <td>${buttonRow('primary', 'Label', false, true)}</td>
          <td>${buttonRow('secondary', 'Label', false, true)}</td>
          <td>${buttonRow('ghost', 'Label', false, true)}</td>
        </tr>
        <tr>
          <th class="row-head" scope="row">Icon only</th>
          <td>${buttonIconOnly('primary', false)}</td>
          <td>${buttonIconOnly('secondary', false)}</td>
          <td>${buttonIconOnly('ghost', false)}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <h2 id="icons">Icons (16×24 display)</h2>
  <p class="lead">Paths match the React SVGs; fills use <code>--color-icon-surface-*</code>.</p>
  <div class="icon-grid">
    ${iconCards}
  </div>
</body>
</html>
`;

const out = join(root, 'public/component-showcase.html');
fs.writeFileSync(out, html, 'utf8');
console.log('Wrote', out);
