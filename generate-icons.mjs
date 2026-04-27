import { writeFileSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Create SVG icon and save as SVG (browsers can use it, and we can inline it)
function makeSvgIcon(size) {
  const s = size;
  const pad = Math.round(s * 0.13);
  const r = Math.round(s * 0.16);

  // Calendar dimensions
  const cx = pad;
  const cy = Math.round(s * 0.18);
  const cw = s - pad * 2;
  const ch = Math.round(s * 0.7);
  const hh = Math.round(s * 0.18); // header height
  const cr = Math.round(s * 0.055);

  const dotX = cx + Math.round(cw * 0.28);
  const dotR = Math.round(s * 0.028);
  const lineX = dotX;
  const lineTop = cy + hh + Math.round(s * 0.04);
  const lineBot = cy + ch - Math.round(s * 0.04);
  const cardX = dotX + Math.round(s * 0.07);
  const cardW = cx + cw - cardX - Math.round(s * 0.03);
  const cardH = Math.round(s * 0.075);
  const cardR = Math.round(s * 0.018);
  const gap = Math.round(s * 0.115);

  const items = [
    { y: lineTop + Math.round(s * 0.005), fill: '#2eaa72' },
    { y: lineTop + gap, fill: '#2eaa72' },
    { y: lineTop + gap * 2, fill: '#b0b0b0' },
    { y: lineTop + gap * 3, fill: '#3a7fcc' },
  ];

  const itemsSvg = items.map(item => {
    const dy = item.y + Math.round(cardH * 0.5);
    return `
    <circle cx="${dotX}" cy="${dy}" r="${dotR}" fill="${item.fill}"/>
    <rect x="${cardX}" y="${item.y}" width="${cardW}" height="${cardH}" rx="${cardR}" fill="white" stroke="#e8e8e8" stroke-width="${Math.max(1, Math.round(s * 0.008))}"/>
    <rect x="${cardX + Math.round(s * 0.02)}" y="${item.y + Math.round(s * 0.022)}" width="${Math.round(cardW * 0.58)}" height="${Math.round(s * 0.016)}" rx="${Math.round(s * 0.008)}" fill="#1a1a1a"/>
    <rect x="${cardX + Math.round(s * 0.02)}" y="${item.y + Math.round(s * 0.048)}" width="${Math.round(cardW * 0.4)}" height="${Math.round(s * 0.011)}" rx="${Math.round(s * 0.005)}" fill="#a0a0a0"/>`;
  }).join('');

  const ringR = Math.round(s * 0.038);
  const ring1X = cx + Math.round(cw * 0.28);
  const ring2X = cx + Math.round(cw * 0.72);
  const ringY = cy;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
  <rect width="${s}" height="${s}" rx="${r}" fill="#f8f8f8"/>

  <!-- Calendar body -->
  <rect x="${cx}" y="${cy}" width="${cw}" height="${ch}" rx="${cr}" fill="white" stroke="#e0e0e0" stroke-width="${Math.max(1, Math.round(s * 0.012))}"/>

  <!-- Calendar header -->
  <rect x="${cx}" y="${cy}" width="${cw}" height="${hh}" rx="${cr}" fill="#1a1a1a"/>
  <rect x="${cx}" y="${cy + cr}" width="${cw}" height="${hh - cr}" fill="#1a1a1a"/>

  <!-- Binding rings -->
  <circle cx="${ring1X}" cy="${ringY}" r="${ringR}" fill="none" stroke="#f8f8f8" stroke-width="${Math.round(s * 0.028)}"/>
  <circle cx="${ring2X}" cy="${ringY}" r="${ringR}" fill="none" stroke="#f8f8f8" stroke-width="${Math.round(s * 0.028)}"/>
  <!-- Ring clips (top half visible above calendar) -->
  <rect x="${ring1X - ringR - 2}" y="${ringY - ringR - 2}" width="${ringR * 2 + 4}" height="${ringR + 2}" rx="${ringR}" fill="#1a1a1a"/>
  <rect x="${ring2X - ringR - 2}" y="${ringY - ringR - 2}" width="${ringR * 2 + 4}" height="${ringR + 2}" rx="${ringR}" fill="#1a1a1a"/>

  <!-- Timeline spine -->
  <line x1="${lineX}" y1="${lineTop}" x2="${lineX}" y2="${lineBot}" stroke="#e0e0e0" stroke-width="${Math.round(s * 0.014)}"/>

  <!-- Schedule items -->
  ${itemsSvg}
</svg>`;
}

// Write SVG icons (used as apple-touch-icon fallback and for reference)
const svg192 = makeSvgIcon(192);
const svg512 = makeSvgIcon(512);

writeFileSync(join(__dirname, 'public', 'icon.svg'), svg192);
writeFileSync(join(__dirname, 'public', 'icon-512.svg'), svg512);

// Create minimal 1x1 PNG as placeholder for icon-192.png and icon-512.png
// Real icons are served as SVG via the manifest
// For the apple-touch-icon we'll use the SVG inline in index.html

// Create a proper PNG using raw bytes
// Simple approach: create an SVG data URI that Safari will use
console.log('SVG icons written to public/icon.svg and public/icon-512.svg');
console.log('Update manifest.json to use SVG icons');
