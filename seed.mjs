import { createClient } from '@sanity/client'
import 'dotenv/config'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  apiVersion: '2024-03-12',
  token: process.env.SANITY_AUTH_TOKEN || "skDLhZXax2q0aTNWdmiKTTTIl3U2HUL8Vt0INxdjFLmD07vhfG5vIXxbCEUvMf4kx34YLyGGyrwjyp9EaLepVlzAATrtmMZMuampciijeRkDTcgm193h2crGOVHh9hhCgQ269bBIYEPSJcJYnOP1GPxIKICLZCKhQyxjd2p6L0FpovqSJhKf",
})

async function seedProducts() {
  const genericBrandId = "1be3e4ee-cf6f-42a1-a7b2-03ee3f2eff2f"; // Will create a generic brand first

  console.log("Creating Brand...");
  const brand = await client.create({
    _id: genericBrandId,
    _type: 'brand',
    title: 'Generic',
    isGeneric: true
  });
  console.log(`✅ Created Generic Brand`);

  console.log("Fetching Categories to link...");
  const categories = await client.fetch(`*[_type == "category"]{ _id, "slug": slug.current }`);
  const catMap = categories.reduce((acc, cat) => {
    acc[cat.slug] = cat._id;
    return acc;
  }, {});

  const products = [
    {
      _type: 'product',
      title: { en: "8074-3 UV DTF Printer", ar: "طابعة 8074-3 UV DTF" },
      slug: { _type: 'slug', current: "8074-3-uv-dtf-printer" },
      category: { _type: 'reference', _ref: catMap['machines'] },
      brand: { _type: 'reference', _ref: genericBrandId },
      warrantyMonths: 12,
      specifications: [
        { _key: "s1", name: { en: "Print Speed", ar: "سرعة الطباعة" }, value: { en: "4 pass 10 m2/h | 6 pass 7 m2/h | 8 pass 4 m2/h", ar: "4 تمريرات 10 متر/ساعة | 6 تمريرات 7 متر/ساعة | 8 تمريرات 4 متر/ساعة" } },
        { _key: "s2", name: { en: "Resolution", ar: "الدقة" }, value: { en: "3200dpi", ar: "3200dpi" } },
        { _key: "s3", name: { en: "Print Size", ar: "حجم الطباعة" }, value: { en: "600mm", ar: "600 مم" } },
        { _key: "s4", name: { en: "Ink Type", ar: "نوع الحبر" }, value: { en: "UV ink", ar: "حبر UV" } },
        { _key: "s5", name: { en: "Print Head", ar: "رأس الطباعة" }, value: { en: "Epson i3200-U1*3", ar: "إبسون i3200-U1*3" } },
      ]
    },
    {
      _type: 'product',
      title: { en: "Epson UV Print Head I3200", ar: "رأس طباعة أبسون I3200" },
      slug: { _type: 'slug', current: "epson-uv-print-head-i3200" },
      category: { _type: 'reference', _ref: catMap['printers-supplies'] },
      brand: { _type: 'reference', _ref: genericBrandId },
      warrantyMonths: 0,
      specifications: [
        { _key: "s1", name: { en: "Variant", ar: "النوع" }, value: { en: "Epson I3200", ar: "إبسون I3200" } },
        { _key: "s2", name: { en: "Suitable", ar: "مناسب لـ" }, value: { en: "UV", ar: "UV" } },
      ]
    },
    {
      _type: 'product',
      title: { en: "SPT Series LED Screen", ar: "شاشة ليد سلسلة SPT" },
      slug: { _type: 'slug', current: "spt-series-led-screen" },
      category: { _type: 'reference', _ref: catMap['screens'] },
      brand: { _type: 'reference', _ref: genericBrandId },
      warrantyMonths: 24,
      specifications: [
        { _key: "s1", name: { en: "Pixel Pitch (mm)", ar: "درجة البكسل (مم)" }, value: { en: "(6.67), (8), (10)", ar: "(6.67), (8), (10)" } },
        { _key: "s2", name: { en: "Brightness Level", ar: "مستوى السطوع" }, value: { en: "5500-6500 nits", ar: "5500-6500 شمعة" } },
        { _key: "s3", name: { en: "Protection Rating", ar: "تصنيف الحماية" }, value: { en: "IP66", ar: "IP66" } },
      ]
    }
  ];

  console.log("Seeding Products...");
  
  for (const prod of products) {    
    try {
      const res = await client.create(prod);
      console.log(`✅ Created Product: ${prod.title.en} (${res._id})`);
    } catch (err) {
      console.error(`❌ Failed: ${prod.title.en}`, err.message);
    }
  }
}

seedProducts();
