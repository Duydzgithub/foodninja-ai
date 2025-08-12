// Renders Mermaid .mmd files in docs/diagrams to PNG/SVG using mermaid-cli
// Usage: npm run diagrams

const { execSync } = require('child_process');
const { readdirSync, mkdirSync, statSync } = require('fs');
const { join, resolve, basename } = require('path');

const ROOT = resolve(__dirname);
const SRC_DIR = join(ROOT, 'diagrams');
const OUT_DIR = join(ROOT, 'diagrams', 'dist');

try { mkdirSync(OUT_DIR, { recursive: true }); } catch {}

function listMmd(dir) {
  return readdirSync(dir)
    .filter(f => f.endsWith('.mmd'))
    .map(f => join(dir, f))
    .filter(f => statSync(f).isFile());
}

function renderOne(input, type) {
  const outName = basename(input, '.mmd') + '.' + type;
  const outFile = join(OUT_DIR, outName);
  const cmd = `npx --yes @mermaid-js/mermaid-cli -i "${input}" -o "${outFile}" -t default -b transparent`;
  console.log('Render:', outFile);
  execSync(cmd, { stdio: 'inherit' });
}

function main() {
  const files = listMmd(SRC_DIR);
  if (files.length === 0) {
    console.log('No .mmd files found');
    return;
  }
  for (const f of files) {
    renderOne(f, 'png');
    renderOne(f, 'svg');
  }
  console.log('Done. Output at', OUT_DIR);
}

main();
