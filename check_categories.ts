import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
});

async function checkCategories() {
  const categories = await client.fetch('*[_type == "category"]');
  console.log(`Found ${categories.length} categories.`);
  if (categories.length > 0) {
    console.log(categories.map((c: any) => ({ _id: c._id, title: c.title, hasImage: !!c.image, hasIcon: !!c.icon })));
  }
}

checkCategories();
