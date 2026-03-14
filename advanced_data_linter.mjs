import { createClient } from '@sanity/client';
import 'dotenv/config';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  apiVersion: '2024-03-12',
  token: process.env.SANITY_AUTH_TOKEN || "skDLhZXax2q0aTNWdmiKTTTIl3U2HUL8Vt0INxdjFLmD07vhfG5vIXxbCEUvMf4kx34YLyGGyrwjyp9EaLepVlzAATrtmMZMuampciijeRkDTcgm193h2crGOVHh9hhCgQ269bBIYEPSJcJYnOP1GPxIKICLZCKhQyxjd2p6L0FpovqSJhKf",
});

// Capitalize each word in a string, preserving known model caps like "UV", "DTF", etc.
function toTitleCase(str) {
  if (!str) return str;
  const keepCaps = ["UV", "DTF", "LED", "CNC", "AC", "DC", "mm", "cm", "kg", "W", "V"];
  return str.split(' ').map(word => {
    // If it's a known acronym or already looks like a model number (e.g. UT-1290L, 8074-3)
    if (keepCaps.includes(word.toUpperCase()) || /[0-9]/.test(word) || word === word.toUpperCase() && word.length > 3 && !["AND","THE","FOR"].includes(word)) {
      return word; 
    }
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }).join(' ');
}

// Global Category Ref Map (will populate dynamically)
let catMap = {};

const valDictAr = {
  "red": "أحمر", "blue": "أزرق", "green": "أخضر", "black": "أسود", "white": "أبيض", "yellow": "أصفر",
  "transparent": "شفاف", "silver": "فضي", "gold": "ذهبي", "pink": "زهري", "magenta": "أرجواني", "cyan": "سماوي",
  "yes": "نعم", "no": "لا", "matte": "مطفي", "glossy": "لامع", "opaque": "غير شفاف",
};

function translateValue(enVal, arVal) {
  // If the AR value is identical to EN value, maybe we can translate it if it's a common word
  if (enVal === arVal && enVal) {
    const clean = enVal.trim().toLowerCase();
    if (valDictAr[clean]) return valDictAr[clean];
    
    // Check if it's a compound like "Yes / No" etc
    if (clean === "yes / no") return "نعم / لا";
  }
  return arVal;
}

// Clean Keys
const keyDictAr = {
  "Item Name": "اسم العنصر",
  "Size": "الحجم",
  "Color": "اللون",
  "Weight": "الوزن",
  "Thickness": "السماكة",
  "Material": "المادة",
};

function normalizeKey(enKey, arKey) {
  let finalEn = enKey;
  let finalAr = arKey;
  
  if (enKey.toLowerCase().includes("item name")) finalEn = "Item Name";
  
  // Try precise translation override if known
  if (keyDictAr[finalEn]) finalAr = keyDictAr[finalEn];
  
  return { en: finalEn, ar: finalAr };
}

async function run() {
  console.log("Fetching Categories to build mappings...");
  const categories = await client.fetch(`*[_type == "category"]{ _id, "slug": slug.current }`);
  categories.forEach(c => catMap[c.slug] = c._id);

  console.log("Fetching Products...");
  const products = await client.fetch(`*[_type == "product"]{ _id, title, category->{slug}, specifications }`);
  
  let patchCount = 0;

  for (const p of products) {
    let needsPatch = false;
    let newDoc = {};

    // 1. TITLE FORMATTING
    // E.g. FIX: " UT-1290L" or "3.2 m r o l l t o r o l l p r i n t e r"
    let newTitleEn = toTitleCase(p.title.en);
    if (newTitleEn !== p.title.en) {
      newDoc.title = { ...p.title, en: newTitleEn };
      needsPatch = true;
    }

    // 2. CATEGORY HEURISTICS
    const tLower = newTitleEn.toLowerCase();
    let computedSlug = p.category?.slug?.current;
    
    if (tLower.includes("foam")) computedSlug = "foam-sheets";
    else if (tLower.includes("acrylic")) computedSlug = "acrylic-sheets";
    else if (tLower.includes("printer") && !tLower.includes("head") && !tLower.includes("ink") && !tLower.includes("part")) computedSlug = "machines";
    else if (tLower.includes("cnc") || tLower.includes("router")) computedSlug = "machines";
    else if (tLower.includes("ink") || tLower.includes("head ") || tLower.includes("damper") || tLower.includes("filter") || tLower.includes("pump")) computedSlug = "printers-supplies";
    else if (tLower.includes("screen") || tLower.includes("led ")) computedSlug = "screens";
    else if (tLower.includes("banner") || tLower.includes("flex") || tLower.includes("sticker") || tLower.includes("paper")) computedSlug = "digital-printing-materials";
    else if (tLower.includes("stand") || tLower.includes("display") || tLower.includes("roll up") || tLower.includes("flag") || tLower.includes("signage")) computedSlug = "advertisement-materials";
    
    // Strict override for specific items missed by dumb heuristics
    if (tLower === "blades" || tLower === "encoder" || tLower === "cable") computedSlug = "printers-supplies";

    if (computedSlug !== p.category?.slug?.current && catMap[computedSlug]) {
      newDoc.category = {
        _type: 'reference',
        _ref: catMap[computedSlug]
      };
      needsPatch = true;
      console.log(`\n🔀 Category Shift: [${newTitleEn}] moved from '${p.category?.slug?.current}' to '${computedSlug}'`);
    }

    // 3. SPECIFICATIONS REVIEW
    if (p.specifications && p.specifications.length > 0) {
      let modifiedSpecs = false;
      const newSpecs = p.specifications.map(s => {
        let nKey = normalizeKey(s.name?.en || "", s.name?.ar || "");
        let newValAr = translateValue(s.value?.en, s.value?.ar);
        
        // Minor trim on values
        let newValEn = s.value?.en?.replace(/^:\\s*/, '').replace(/\\s+$/, '');
        newValAr = newValAr?.replace(/^:\\s*/, '').replace(/\\s+$/, '');

        if (nKey.en !== s.name?.en || nKey.ar !== s.name?.ar || newValEn !== s.value?.en || newValAr !== s.value?.ar) {
          modifiedSpecs = true;
        }

        return {
          ...s,
          name: { en: nKey.en, ar: nKey.ar },
          value: { en: newValEn, ar: newValAr }
        };
      });

      if (modifiedSpecs) {
        newDoc.specifications = newSpecs;
        needsPatch = true;
      }
    }

    // PATCH IF MUTATED
    if (needsPatch) {
      process.stdout.write(`\n✨ Patching ${newTitleEn} (${p._id})...`);
      try {
        await client.patch(p._id).set(newDoc).commit();
        process.stdout.write(` Success!`);
        patchCount++;
      } catch(err) {
        process.stdout.write(` Failed! ${err.message}`);
      }
    }
  }

  console.log(`\n\n✅ Advanced Data Linting complete. Professionally restructured ${patchCount} products.`);
}

run();
