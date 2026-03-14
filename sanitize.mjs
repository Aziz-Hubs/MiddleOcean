import { createClient } from '@sanity/client';
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
  // Replace non-breaking spaces and other weird whitespace with normal spaces, then trim
  let clean = str.replace(/[\\u00A0\\u202F\\u2007\\u2060]/g, ' ');
  // Remove excess whitespace
  clean = clean.replace(/\\s+/g, ' ');
  return clean.trim();
}

async function run() {
  console.log("Fetching all products...");
  const products = await client.fetch(`*[_type == "product"]{ _id, title, specifications }`);
  
  let patchCount = 0;

  for (const p of products) {
    let needsPatch = false;
    let newDoc = {
      title: { ...p.title },
    };

    // Clean Titles
    const enClean = cleanString(p.title.en);
    const arClean = cleanString(p.title.ar);
    if (enClean !== p.title.en || arClean !== p.title.ar) {
      newDoc.title.en = enClean;
      newDoc.title.ar = arClean;
      needsPatch = true;
    }

    // Clean Specs
    if (p.specifications) {
      const newSpecs = p.specifications.map(s => {
        const sEnName = cleanString(s.name?.en);
        const sArName = cleanString(s.name?.ar);
        const sEnValue = cleanString(s.value?.en);
        const sArValue = cleanString(s.value?.ar);

        if (sEnName !== s.name?.en || sArName !== s.name?.ar || sEnValue !== s.value?.en || sArValue !== s.value?.ar) {
          needsPatch = true;
        }

        return {
          ...s,
          name: { en: sEnName, ar: sArName },
          value: { en: sEnValue, ar: sArValue }
        };
      });

      if (needsPatch) {
        newDoc.specifications = newSpecs;
      }
    }

    if (needsPatch) {
      console.log(`Patching product: ${p.title.en} (${p._id})`);
      try {
        await client.patch(p._id).set(newDoc).commit();
        patchCount++;
      } catch(err) {
        console.error(`Failed to patch ${p._id}:`, err.message);
      }
    }
  }

  console.log(`Finished sanitization! Patched ${patchCount} products.`);
}

run();
