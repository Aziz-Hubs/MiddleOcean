import fs from 'fs';
import * as cheerio from 'cheerio';
import { createClient } from '@sanity/client';
import 'dotenv/config';
import https from 'https';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  apiVersion: '2024-03-12',
  token: process.env.SANITY_AUTH_TOKEN || "skDLhZXax2q0aTNWdmiKTTTIl3U2HUL8Vt0INxdjFLmD07vhfG5vIXxbCEUvMf4kx34YLyGGyrwjyp9EaLepVlzAATrtmMZMuampciijeRkDTcgm193h2crGOVHh9hhCgQ269bBIYEPSJcJYnOP1GPxIKICLZCKhQyxjd2p6L0FpovqSJhKf",
});

const legacyProducts = JSON.parse(fs.readFileSync('legacy_products.json', 'utf8'));

const catMap = {
  "Screens": "screens",
  "Machines": "machines",
  "Acrylic &amp; Foam Sheets": "acrylic-sheets", // We'll default to acrylic, manual adjustment if foam
  "Advertising Material": "advertisement-materials",
  "Printers Supplies": "printers-supplies",
  "Digital Printing material": "digital-printing-materials",
  "Fabric and Panels": "digital-printing-materials" // Mapping to digital printing for now
};

// Extremely robust dictionary based on Sanity specifications
const arDict = {
  "Pixel Pitch (mm)": "درجة البكسل (مم)",
  "Pixel Density": "كثافة البكسل",
  "LED Arrangement": "ترتيب الليد",
  "Module Resolution": "دقة الوحدة",
  "Module Dimensions": "أبعاد الوحدة",
  "Module Weight": "وزن الوحدة",
  "Module Thickness": "سماكة الوحدة",
  "Grey Scale (bit)": "التدرج الرمادي (بت)",
  "Brightness Level": "مستوى السطوع",
  "Cabinet Size": "حجم الكابينة",
  "Cabinet Weight (kg)": "وزن الكابينة (كجم)",
  "Cabinet Thickness (mm)": "سماكة الكابينة (مم)",
  "Max Power Consumption W": "الحد الأقصى لاستهلاك الطاقة (واط)",
  "Avg Power Consumption W": "متوسط استهلاك الطاقة (واط)",
  "Visual View Angle": "زاوية الرؤية",
  "Input Voltage(V)": "جهد الدخل (فولت)",
  "Working Temperature (℃)": "درجة حرارة التشغيل (مئوية)",
  "Refresh Rate": "معدل التحديث",
  "Protection Rating": "تصنيف الحماية",
  "LED Type": "نوع الليد",
  "Cabinet Resolution (WxH)": "دقة الكابينة (عرض × ارتفاع)",
  "Cabinet Size (mm) (WxH)": "حجم الكابينة (مم) (عرض × ارتفاع)",
  "Cabinet Weight (kg/unit)": "وزن الكابينة (كجم/وحدة)",
  "Brightness(nits)": "السطوع (شمعة)",
  "Horizontal Viewing Angle (°)": "زاوية الرؤية الأفقية",
  "Vertical Viewing Angle (°)": "زاوية الرؤية العمودية",
  "Driving Mode": "وضع القيادة",
  "Contrast Ratio": "نسبة التباين",
  "Max Power Consumption (W/m²)": "الحد الأقصى لاستهلاك الطاقة (واط/متر مربع)",
  "Average power consumption(W/m²)": "متوسط استهلاك الطاقة (واط/متر مربع)",
  "Input voltage": "جهد الدخل",
  "Operation temperature (C°)": "درجة حرارة التشغيل (مئوية)",
  "Operation humidity(RH)": "رطوبة التشغيل",
  "Size": "الحجم",
  "Thickness": "السماكة",
  "Warranty": "الضمان",
  "Suitable": "مناسب لـ",
  "Packing": "التعبئة",
  "Color": "اللون",
  "Type": "النوع",
  "Brand": "العلامة التجارية",
  "Code": "الكود",
  "Item Name": "اسم العنصر",
  "Printing speed": "سرعة الطباعة",
  "Resolution": "الدقة",
  "Print Size": "حجم الطباعة",
  "INK": "نوع الحبر",
  "Print Head": "رأس الطباعة",
  "INK supply system": "نظام تزويد الحبر",
  "Circuit board": "اللوحة الإلكترونية",
  "Power supply": "مزود الطاقة",
  "Temperature": "درجة الحرارة",
  "Humidity": "الرطوبة",
  "RIP Software": "برنامج RIP",
  "Package Size": "حجم العبوة",
  "weight": "الوزن",
  "PC system": "نظام التشغيل",
  "Liters": "اللترات",
  "UV head type": "نوع رأس UV",
  "color": "اللون",
  "Material": "المادة",
  "Length": "الطول",
  "Width": "العرض",
  "Weight": "الوزن",
  "Type ": "النوع",
};

function translate(text) {
  if (!text) return "";
  const clean = text.trim().replace(/:$/, "").replace(/ :$/, "");
  
  // Exact match
  if (arDict[clean]) return arDict[clean];
  
  // Case insensitive match
  const lower = clean.toLowerCase();
  for (const [key, val] of Object.entries(arDict)) {
    if (key.toLowerCase() === lower) return val;
  }
  
  return clean; // Fallback
}

// Global Categories Cache
let sanityCategories = [];

async function uploadImageFromWP(mediaId) {
  if (!mediaId) return null;
  try {
    const res = await fetch(`https://middleocean.jo/wp-json/wp/v2/media/${mediaId}`);
    const media = await res.json();
    const imageUrl = media.source_url;
    
    if (!imageUrl) return null;

    console.log(`Downloading image: ${imageUrl}`);
    const imageRes = await fetch(imageUrl);
    const buffer = await imageRes.arrayBuffer();
    
    const asset = await client.assets.upload('image', Buffer.from(buffer), {
      filename: imageUrl.split('/').pop()
    });
    
    return {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: asset._id
      }
    };
  } catch (err) {
    console.error(`Failed to upload media ${mediaId}:`, err.message);
    return null;
  }
}

async function migrate() {
  sanityCategories = await client.fetch(`*[_type == "category"]{ _id, "slug": slug.current }`);
  
  const genericBrandId = "1be3e4ee-cf6f-42a1-a7b2-03ee3f2eff2f";

  console.log(`Starting migration of ${legacyProducts.length} products...`);

  for (const p of legacyProducts) {
    console.log(`Processing: ${p.title}`);
    
    // Parse the excerpt for Specifications
    const $ = cheerio.load(p.excerpt || p.content || "");
    const specs = [];
    let warrantyMonths = 0;
    
    // WordPress typically uses <p><strong>Key:</strong> Value<br/></p>
    // Or sometimes just split by <br/> or \n
    const textNodes = $.text().split('\n');
    let keyCounter = 0;
    
    for (const line of textNodes) {
      if (!line.includes(':')) continue;
      
      let [key, ...rest] = line.split(':');
      let val = rest.join(':').trim();
      key = key.trim();
      
      if (!key || !val) continue;
      
      if (key.toLowerCase().includes("warranty")) {
        // Try to parse number of years
        const match = val.match(/(\\d+)\\s*(year|yr|month|mo)/i);
        if (match) {
          warrantyMonths = match[2].toLowerCase().startsWith('y') ? parseInt(match[1]) * 12 : parseInt(match[1]);
        }
      }
      
      specs.push({
        _key: `spec-${keyCounter++}-${Math.random().toString(36).substring(7)}`,
        name: { en: key, ar: translate(key) },
        value: { en: val, ar: val } // We keep values as is, since they are usually numbers or models
      });
    }

    // Determine category
    const wpCat = p.categories && p.categories.length > 0 ? p.categories[0] : "Uncategorized";
    const mappedSlug = catMap[wpCat] || "advertisement-materials";
    
    // Overrides based on title
    let finalSlug = mappedSlug;
    if (wpCat === "Acrylic &amp; Foam Sheets") {
      finalSlug = p.title.toLowerCase().includes('foam') ? 'foam-sheets' : 'acrylic-sheets';
    }
    
    const catDoc = sanityCategories.find(c => c.slug === finalSlug);
    const catRef = catDoc ? catDoc._id : sanityCategories[0]._id;

    // Upload Image
    const imageAsset = await uploadImageFromWP(p.featured_media);

    const sanityProduct = {
      _type: 'product',
      title: { en: p.title, ar: p.title }, // Fallback to EN if no Arabic title known trivially
      slug: { _type: 'slug', current: p.slug },
      category: { _type: 'reference', _ref: catRef },
      brand: { _type: 'reference', _ref: genericBrandId },
      warrantyMonths: warrantyMonths,
      media: {
        thumbnail: imageAsset || undefined
      },
      specifications: specs.length > 0 ? specs : undefined
    };

    try {
      // Check if product exists to avoid duplicates
      const exists = await client.fetch(`*[_type == "product" && slug.current == $slug][0]`, { slug: p.slug });
      if (exists) {
        console.log(`Product already exists: ${p.title}. Skipping creation...`);
      } else {
        const res = await client.create(sanityProduct);
        console.log(`✅ Migrated: ${p.title} (${res._id})`);
      }
    } catch (err) {
      console.error(`❌ Complete Failure for ${p.title}:`, err.message);
    }
  }
  
  console.log("Migration Complete!");
}

migrate();
