import { createClient } from '@sanity/client';
import 'dotenv/config';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  apiVersion: '2024-03-12',
  token: process.env.SANITY_AUTH_TOKEN || "skDLhZXax2q0aTNWdmiKTTTIl3U2HUL8Vt0INxdjFLmD07vhfG5vIXxbCEUvMf4kx34YLyGGyrwjyp9EaLepVlzAATrtmMZMuampciijeRkDTcgm193h2crGOVHh9hhCgQ269bBIYEPSJcJYnOP1GPxIKICLZCKhQyxjd2p6L0FpovqSJhKf",
});

async function run() {
  const categories = await client.fetch(`*[_type == "category"]{ _id, title, "slug": slug.current, icon, description }`);

  console.log(`Found ${categories.length} categories.`);
  for (const cat of categories) {
    let patch = client.patch(cat._id);
    let dirty = false;
    let icon = cat.icon;
    let descEn = cat.description?.en;
    let descAr = cat.description?.ar;

    if (!icon || icon === "HelpCircle") {
      dirty = true;
      if (cat.slug === "machines") icon = "Printer";
      else if (cat.slug === "printers-supplies") icon = "PenTool";
      else if (cat.slug === "screens") icon = "Monitor";
      else if (cat.slug === "advertisement-materials") icon = "Megaphone";
      else if (cat.slug === "digital-printing-materials") icon = "Layers";
      else if (cat.slug === "acrylic-sheets") icon = "Box";
      else if (cat.slug === "foam-sheets") icon = "Package";
      else icon = "Folder";
      patch = patch.set({ icon });
    }

    if (!cat.description) {
      dirty = true;
      const titleEn = cat.title?.en || cat.slug;
      descEn = `Explore our selection of top-quality ${titleEn.toLowerCase()}.`;
      const titleAr = cat.title?.ar || titleEn;
      descAr = `اكتشف تشكيلتنا الواسعة من ${titleAr}.`;
      patch = patch.set({ description: { en: descEn, ar: descAr } });
    }

    if (dirty) {
      console.log(`Patching category "${cat.title?.en}" with icon "${icon}" and description...`);
      await patch.commit();
      console.log(`   Done.`);
    }
  }
}

run().catch(console.error);
