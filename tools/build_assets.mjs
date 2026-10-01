// Rebuilds the public CV PDF and the social preview card from the HTML
// sources in this folder, using a local Chromium-based browser in headless mode.
//
//   node tools/build_assets.mjs
//
// Set BROWSER to a Chrome/Edge executable if it is not in a default location.
// Needs a network connection so the Google Fonts used by the identity load.

import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const tools = dirname(fileURLToPath(import.meta.url));
const assets = resolve(tools, '..', 'assets');

const candidates = [
  process.env.BROWSER,
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium'
].filter(Boolean);
const browser = candidates.find((path) => existsSync(path));
if (!browser) throw new Error('No Chrome/Edge found. Set BROWSER to its executable path.');

const profile = mkdtempSync(join(tmpdir(), 'portfolio-build-'));
const run = (args) => execFileSync(browser, [
  '--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run',
  `--user-data-dir=${profile}`, '--virtual-time-budget=8000', ...args
], { stdio: 'ignore' });

try {
  run([
    '--no-pdf-header-footer',
    `--print-to-pdf=${join(assets, 'Ahmed_AlYazid_CV.pdf')}`,
    pathToFileURL(join(tools, 'cv.html')).href
  ]);
  console.log('Built assets/Ahmed_AlYazid_CV.pdf');

  run([
    '--window-size=1200,630',
    `--screenshot=${join(assets, 'og-card.png')}`,
    pathToFileURL(join(tools, 'og.html')).href
  ]);
  console.log('Built assets/og-card.png');
} finally {
  rmSync(profile, { recursive: true, force: true });
}
