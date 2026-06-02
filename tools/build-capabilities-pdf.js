/* Babylon Consulting — Capabilities one-pager (2 pages, US Letter)
   Brand: Babylon Blue identity v2. Pure vector + PNG mark via pdfkit. */
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// ---- Brand palette -------------------------------------------------------
const C = {
  babylon:   '#14284A',
  dark:      '#0E1D38',
  lapis:     '#2C4870',
  stone:     '#FBFBF9',
  paper:     '#FFFFFF',
  gold:      '#B89B5E',
  ink:       '#1F2937',
  g700:      '#374151',
  g600:      '#4B5563',
  g500:      '#6B7280',
  g300:      '#D1D5DB',
  g200:      '#E5E7EB',
  creamDim:  'rgba',
};
const CREAM      = '#FBFBF9';
const CREAM_80   = '#D8DCE3'; // approximated light tint on navy
const CREAM_60   = '#9FA8B8';

// ---- Fonts ---------------------------------------------------------------
const F = {
  serif:  '/usr/share/fonts/truetype/liberation/LiberationSerif-Regular.ttf',
  serifB: '/usr/share/fonts/truetype/liberation/LiberationSerif-Bold.ttf',
  serifI: '/usr/share/fonts/truetype/liberation/LiberationSerif-Italic.ttf',
  sans:   '/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf',
  sansB:  '/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf',
};

const ROOT = path.resolve(__dirname, '..');
const OUT  = path.join(ROOT, 'brand', 'babylon-capabilities.pdf');

const PW = 612, PH = 792;            // Letter
const MX = 54;                       // side margin
const CW = PW - MX * 2;              // content width = 504

const doc = new PDFDocument({ size: 'LETTER', margin: 0, autoFirstPage: true,
  info: { Title: 'Babylon Consulting — Capabilities', Author: 'Babylon Consulting LLC' } });
doc.registerFont('serif',  F.serif);
doc.registerFont('serifB', F.serifB);
doc.registerFont('serifI', F.serifI);
doc.registerFont('sans',   F.sans);
doc.registerFont('sansB',  F.sansB);
const stream = fs.createWriteStream(OUT);
doc.pipe(stream);

// ---- Helpers -------------------------------------------------------------
function ziggurat(x, y, size, color) {
  // viewBox 0 0 42 42, 4 stacked steps (matches site mark)
  const s = size / 42;
  const rects = [[2,33,38,6],[6,24,30,7],[11,14,20,8],[15,3,12,9]];
  for (const [rx, ry, rw, rh] of rects) {
    doc.rect(x + rx*s, y + ry*s, rw*s, rh*s).fill(color);
  }
}

function eyebrow(x, y, text, color, withRule) {
  if (withRule) {
    doc.save().rect(x, y + 4, 22, 1.6).fill(color).restore();
  }
  doc.font('sansB').fontSize(8).fillColor(color)
     .text(text.toUpperCase(), x + (withRule ? 32 : 0), y,
           { characterSpacing: 1.8, lineBreak: false });
}

function wordmark(x, y, markSize, color, sub) {
  ziggurat(x, y, markSize, color);
  const tx = x + markSize + 12;
  doc.font('serif').fontSize(21).fillColor(color)
     .text('Babylon', tx, y - 1, { lineBreak: false });
  doc.font('sansB').fontSize(7.5).fillColor(sub)
     .text('CONSULTING', tx + 1, y + 23, { characterSpacing: 3, lineBreak: false });
}

// =========================================================================
// PAGE 1 — Cover / Firm overview
// =========================================================================

// Header band
const BAND = 322;
doc.rect(0, 0, PW, BAND).fill(C.babylon);
// subtle deeper foot strip
doc.rect(0, BAND - 6, PW, 6).fill(C.dark);
// faint ziggurat watermark, lower right of band
doc.save().opacity(0.05);
ziggurat(PW - 250, BAND - 250, 230, CREAM);
doc.restore();

// Wordmark + confidential tag
wordmark(MX, 52, 30, CREAM, CREAM_60);
doc.font('sansB').fontSize(7.5).fillColor(CREAM_60)
   .text('CONFIDENTIAL · PREPARED FOR DISCUSSION', MX, 60, {
     width: CW, align: 'right', characterSpacing: 1.6, lineBreak: false });

// Headline (flows across lines; closing phrase italic gold)
doc.font('serif').fontSize(29).fillColor(CREAM)
   .text('Energy, healthcare, and applied AI — under ', MX, 120,
         { width: 466, lineGap: 3, continued: true });
doc.font('serifI').fillColor(C.gold)
   .text('one disciplined firm.', { continued: false });

// Lede
const ledeY = doc.y + 16;
doc.font('sans').fontSize(11).fillColor(CREAM_80)
   .text('Babylon Consulting transacts steam and gas turbines as a direct principal, and advises across healthcare operations and artificial intelligence. One standard of discretion and execution, applied wherever the work demands it.',
     MX, ledeY, { width: 452, lineGap: 3 });

// gold rule
doc.rect(MX, doc.y + 14, 60, 2).fill(C.gold);

// ---- Firm overview -------------------------------------------------------
let y = BAND + 38;
eyebrow(MX, y, 'Firm Overview', C.babylon, true);
y += 24;
doc.font('serif').fontSize(20).fillColor(C.ink)
   .text('A principal in the market — not a name on the sidelines.', MX, y, { width: 430 });
y = doc.y + 12;
doc.font('sans').fontSize(10.5).fillColor(C.g700)
   .text('Babylon Consulting LLC is a privately held firm headquartered in the United States and engaged worldwide. Our core business is the acquisition and sale of steam and gas turbines for power producers, industrial operators, and project developers. Around that core we run two focused advisory practices — healthcare and AI & data — measured by outcomes delivered, not reports issued.',
     MX, y, { width: CW, lineGap: 2.5 });

// ---- Sectors at a glance (3 columns) ------------------------------------
y = doc.y + 26;
const sectors = [
  ['01', 'Oil · Gas · Energy', 'Steam & gas turbine acquisition and sale — new, surplus, and pre-owned — as a direct principal.'],
  ['02', 'Healthcare', 'Operational and growth advisory for medical and specialty practices and provider groups.'],
  ['03', 'AI & Data', 'AI strategy, workflow automation, and data architecture built to run in production.'],
];
const colW = (CW - 2 * 24) / 3;
sectors.forEach((s, i) => {
  const cx = MX + i * (colW + 24);
  doc.rect(cx, y, colW, 3).fill(C.babylon);
  doc.font('sansB').fontSize(8).fillColor(C.gold)
     .text(s[0], cx, y + 14, { characterSpacing: 2, lineBreak: false });
  doc.font('serif').fontSize(14).fillColor(C.babylon)
     .text(s[1], cx, y + 28, { width: colW });
  doc.font('sans').fontSize(9.5).fillColor(C.g600)
     .text(s[2], cx, doc.y + 4, { width: colW, lineGap: 2 });
});

// ---- Stat strip ----------------------------------------------------------
y = 632;
doc.rect(MX, y, CW, 2).fill(C.babylon);
doc.rect(MX, y + 86, CW, 2).fill(C.babylon);
const stats = [
  ['Direct', 'Buyer & Seller'],
  ['Global', 'Reach & Sourcing'],
  ['Steam & Gas', 'Turbine Specialists'],
  ['Discreet', 'By Default'],
];
const sW = CW / 4;
stats.forEach((st, i) => {
  const sx = MX + i * sW;
  if (i > 0) doc.rect(sx, y + 20, 1, 48).fill(C.g200);
  doc.font('serif').fontSize(16).fillColor(C.babylon)
     .text(st[0], sx + 14, y + 24, { width: sW - 16, lineBreak: false });
  doc.font('sansB').fontSize(7).fillColor(C.g500)
     .text(st[1].toUpperCase(), sx + 14, y + 52, { width: sW - 14, characterSpacing: 1.2 });
});

// ---- Footer (page 1) -----------------------------------------------------
function footer(pageLabel) {
  const fy = 752;
  doc.rect(MX, fy, CW, 1).fill(C.g200);
  doc.font('sansB').fontSize(7.5).fillColor(C.g500)
     .text('BABYLON CONSULTING LLC', MX, fy + 10, { characterSpacing: 1.4, lineBreak: false });
  doc.font('sans').fontSize(8).fillColor(C.g500)
     .text('ahmed@babylonconsulting.us   ·   babylonconsulting.us', MX, fy + 10,
           { width: CW, align: 'center', lineBreak: false });
  doc.font('sans').fontSize(8).fillColor(C.g500)
     .text(pageLabel, MX, fy + 10, { width: CW, align: 'right', lineBreak: false });
}
footer('Page 1 of 2');

// =========================================================================
// PAGE 2 — Sectors in depth + confidential engagements
// =========================================================================
doc.addPage({ size: 'LETTER', margin: 0 });

// slim header
doc.rect(0, 0, PW, 70).fill(C.babylon);
wordmark(MX, 22, 24, CREAM, CREAM_60);
doc.font('sansB').fontSize(7.5).fillColor(CREAM_60)
   .text('SECTORS & ENGAGEMENTS', MX, 34, { width: CW, align: 'right', characterSpacing: 1.6, lineBreak: false });

y = 96;
eyebrow(MX, y, 'Where We Operate', C.babylon, true);
y += 22;
doc.font('serif').fontSize(20).fillColor(C.ink)
   .text('Three sectors. One standard of execution.', MX, y, { width: CW });
y = doc.y + 14;

// Sector rows
const rows = [
  ['Oil · Gas · Energy', 'Direct Principal',
   'We buy and sell steam and gas turbines on our own account — principal to principal, with clear title, verified condition, and certainty of delivery. Heavy-duty frame and aeroderivative gas turbines, condensing and back-pressure steam turbines, and complete generating packages.',
   ['Steam & Gas Turbines', 'New · Surplus · Pre-Owned', '50 Hz & 60 Hz', 'Complete Power Packages']],
  ['Healthcare', 'Advisory Practice',
   'Hands-on operational and growth advisory for medical and specialty practices: workflow and intake redesign, staffing models, patient experience, and the practice-management and digital systems underneath them.',
   ['Operations & Workflow', 'Growth & Retention', 'Systems & Technology']],
  ['AI & Data', 'Advisory Practice',
   'AI strategy, workflow automation, and data architecture for organizations modernizing how they operate — delivered as systems that run in production, with humans kept in the loop where judgment matters.',
   ['AI Strategy', 'Workflow Automation', 'Data Architecture']],
];
rows.forEach((r) => {
  doc.rect(MX, y + 2, 3, 58).fill(C.babylon);
  doc.font('serif').fontSize(15).fillColor(C.babylon)
     .text(r[0], MX + 16, y, { width: 300, lineBreak: false });
  doc.font('sansB').fontSize(7.5).fillColor(C.gold)
     .text(r[1].toUpperCase(), MX + 16, y + 4, { width: CW - 16, align: 'right', characterSpacing: 1.6, lineBreak: false });
  doc.font('sans').fontSize(9.8).fillColor(C.g700)
     .text(r[2], MX + 16, y + 22, { width: CW - 16, lineGap: 2 });
  // capability chips
  let chipY = doc.y + 7;
  doc.font('sansB').fontSize(7.5).fillColor(C.g600);
  let cx = MX + 16;
  r[3].forEach((chip) => {
    const w = doc.widthOfString(chip.toUpperCase(), { characterSpacing: 1 }) + 8;
    if (cx + w > MX + CW) { cx = MX + 16; chipY += 16; }
    doc.rect(cx, chipY - 2, 4, 4).fill(C.gold);
    doc.fillColor(C.g600).text(chip.toUpperCase(), cx + 8, chipY - 3.5, { characterSpacing: 1, lineBreak: false });
    cx += w + 18;
  });
  y = chipY + 26;
});

// ---- Confidential engagements block -------------------------------------
const bx = MX, bw = CW;
const by = y + 6;
const bh = 198;
doc.rect(bx, by, bw, bh).fill(C.babylon);
doc.rect(bx, by, 4, bh).fill(C.gold);
// faint mark
doc.save().opacity(0.06);
ziggurat(bx + bw - 158, by + bh - 158, 150, CREAM);
doc.restore();

eyebrow(bx + 28, by + 26, 'Confidential Engagements', C.gold, true);
doc.font('serif').fontSize(17).fillColor(CREAM)
   .text('Active NDAs across U.S. data-center infrastructure.', bx + 28, by + 44, { width: bw - 56 });
doc.font('sans').fontSize(9.8).fillColor(CREAM_80)
   .text('Babylon Consulting maintains active non-disclosure agreements across multiple engagements in the United States, principally tied to data-center developments and the power systems that serve them. Counterparties and project specifics are withheld in accordance with those agreements.',
     bx + 28, by + 78, { width: bw - 56, lineGap: 2.8 });
doc.rect(bx + 28, doc.y + 12, 30, 1.5).fill(C.gold);
doc.font('sansB').fontSize(8.8).fillColor(C.gold)
   .text('The U.S. data-center buildout is driving sustained demand for on-site and grid generation — the steam and gas turbine capacity Babylon sources and transacts as principal.',
     bx + 28, doc.y + 10, { width: bw - 56, lineGap: 2 });

footer('Page 2 of 2');

doc.end();
stream.on('finish', () => console.log('WROTE', OUT));
