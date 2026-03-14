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

function cleanString(str) {
  if (!str) return str;
  let clean = str.replace(/[\\u00A0\\u202F\\u2007\\u2060]/g, ' ');
  clean = clean.replace(/\\s+/g, ' ');
  return clean.trim();
}

async function restore() {
  console.log("Reading legacy products backup...");
  const legacyMap = new Map();
  const legacy = JSON.parse(fs.readFileSync('legacy_products.json', 'utf8'));
  
  // We match by slug to perfectly restore the original names.
  for (const lp of legacy) {
    if (lp.slug) {
      legacyMap.set(lp.slug, cleanString(lp.title));
    }
  }

  console.log("Fetching corrupted Sanity titles...");
  const products = await client.fetch(`*[_type == "product"]{ _id, title, "slug": slug.current }`);

  let count = 0;
  for (const p of products) {
    if (!p.slug) continue;
    
    const originalName = legacyMap.get(p.slug);
    if (!originalName) continue; // Seeded products skip this

    const currentEn = cleanString(p.title.en);
    const currentAr = cleanString(p.title.ar);

    if (currentEn !== originalName || currentAr !== originalName) {
      const newTitle = { en: originalName, ar: originalName };
      console.log(`Restoring [${p.slug}] -> ${originalName}`);
      try {
        await client.patch(p._id).set({ title: newTitle }).commit();
        count++;
      } catch (err) {
        console.error(`Failed to restore ${p.slug}: ${err.message}`);
      }
    }
  }

  console.log(`✅ Title restoration complete. Patched ${count} products.`);
}

restore();
