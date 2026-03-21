import { sanityClient } from "./sanity/client.js";
import { productsByCategoryPagedQuery, productsByCategoryCountQuery } from "./sanity/queries.ts";

const slug = "machines";
const start = 0;
const end = 12;

async function test() {
  try {
    console.log(`Testing count for category: ${slug}`);
    const totalCount = await sanityClient.fetch(productsByCategoryCountQuery, { slug });
    console.log(`Total count: ${totalCount}`);

    console.log(`Testing paged fetch for category: ${slug}`);
    const products = await sanityClient.fetch(productsByCategoryPagedQuery, { slug, start, end });
    console.log(`Found ${products.length} products.`);
  } catch (error) {
    console.error("Error fetching data from Sanity:", error);
  }
}

test();
