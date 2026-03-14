import { createClient } from '@sanity/client';
import fs from 'fs';
import 'dotenv/config';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  apiVersion: '2024-03-12',
  token: process.env.SANITY_AUTH_TOKEN || "skDLhZXax2q0aTNWdmiKTTTIl3U2HUL8Vt0INxdjFLmD07vhfG5vIXxbCEUvMf4kx34YLyGGyrwjyp9EaLepVlzAATrtmMZMuampciijeRkDTcgm193h2crGOVHh9hhCgQ269bBIYEPSJcJYnOP1GPxIKICLZCKhQyxjd2p6L0FpovqSJhKf",
});

function safeClean(str) {
  if (!str) return str;
  // Use character codes directly to avoid regex compilation double-escaping bugs
  let s = str;
  s = s.replace(new RegExp(String.fromCharCode(160), 'g'), ' '); // NBSP
  s = s.replace(new RegExp(String.fromCharCode(8239), 'g'), ' '); // NNBSP
  s = s.replace(new RegExp(String.fromCharCode(8199), 'g'), ' '); // Figure Space
  s = s.replace(new RegExp(String.fromCharCode(8288), 'g'), ' '); // Word Joiner
  
  // Collapse whitespace
  s = s.replace(/\\s+/g, ' '); 
  // Wait, if \\s+ writes \s+ then that's fine. If it writes s+, I'll just use split and join!
  return s.split(' ').filter(p => p.trim() !== '').join(' ').trim();
}

async function restore() {
  console.log("Reading legacy products backup...");
  const legacyMap = new Map();
  const legacySpecs = new Map();
  const legacyCat = new Map();
  
  const legacy = JSON.parse(fs.readFileSync('legacy_products.json', 'utf8'));
  
  for (const lp of legacy) {
    if (lp.slug) {
      legacyMap.set(lp.slug, safeClean(lp.title));
      // In case we mangled the specs too, we should actually reconstruct them entirely? 
      // The linter did touch specs if they matched. 
      // Actually the linter only updated values. The original specs were seeded in migrate.mjs
    }
  }

  const products = await client.fetch(`*[_type == "product"]{ _id, title, "slug": slug.current }`);

  let count = 0;
  for (const p of products) {
    if (!p.slug) continue;
    
    const originalName = legacyMap.get(p.slug);
    if (!originalName) continue; // It's one of the manually seeded items like 8074-3

    const newTitle = { en: originalName, ar: originalName };
    console.log(`Restoring [${p.slug}] -> ${originalName}`);
    try {
      await client.patch(p._id).set({ title: newTitle }).commit();
      count++;
    } catch (err) {
      console.error(`Failed to restore ${p.slug}: ${err.message}`);
    }
  }

  // Also fix manually seeded products if we broke them
  const manualFixes = {
    "8074-3-uv-dtf-printer": "8074-3 UV DTF Printer",
    "epson-uv-print-head-i3200": "Epson UV Print Head I3200",
    "spt-series-led-screen": "SPT Series LED Screen"
  };

  for (const [slug, correctName] of Object.entries(manualFixes)) {
    const p = await client.fetch(`*[_type == "product" && slug.current == $s][0]`, { s: slug });
    if (p) {
      console.log(`Manually Restoring [${slug}] -> ${correctName}`);
      await client.patch(p._id).set({ title: { en: correctName, ar: correctName } }).commit();
    }
  }

  console.log(`✅ Title restoration complete. Patched ${count} products.`);
}

restore();
