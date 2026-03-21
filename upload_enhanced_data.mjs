import { createClient } from '@sanity/client';
import fs from 'fs';
import 'dotenv/config';

// Configuration
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  apiVersion: '2024-03-12',
  token: process.env.SANITY_AUTH_TOKEN,
});

const DRY_RUN = process.env.DRY_RUN === 'true';
const BATCH_SIZE = 10;

async function uploadData() {
  if (!process.env.SANITY_AUTH_TOKEN) {
    console.error("❌ SANITY_AUTH_TOKEN is missing in .env.local");
    process.exit(1);
  }

  const rawData = fs.readFileSync('enhanced_data.json', 'utf8');
  const products = JSON.parse(rawData);

  console.log(`🚀 Starting upload of ${products.length} products (Batch Size: ${BATCH_SIZE}, Dry Run: ${DRY_RUN})`);

  for (let i = 0; i < products.length; i += BATCH_SIZE) {
    const batch = products.slice(i, i + BATCH_SIZE);
    console.log(`\\n📦 Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(products.length / BATCH_SIZE)}...`);

    const transaction = client.transaction();

    batch.forEach(product => {
      if (DRY_RUN) {
        console.log(`🔍 [DRY RUN] Would update: ${product.id} (${product.title_ar})`);
      } else {
        transaction.patch(product.id, {
          set: {
            "title.ar": product.title_ar,
            "description.en": product.description_en,
            "description.ar": product.description_ar
          }
        });
      }
    });

    if (!DRY_RUN) {
      try {
        await transaction.commit();
        console.log(`✅ Batch ${Math.floor(i / BATCH_SIZE) + 1} committed successfully.`);
      } catch (err) {
        console.error(`❌ Failed to commit batch ${Math.floor(i / BATCH_SIZE) + 1}:`, err.message);
      }
    }
  }

  console.log("\\n✨ Upload process completed.");
}

uploadData().catch(console.error);
