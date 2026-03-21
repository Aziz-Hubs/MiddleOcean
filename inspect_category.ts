import { sanityClient } from "./sanity/client.js";
import { categoryBySlugQuery } from "./sanity/queries.ts";

const slug = "machines";

async function inspect() {
  try {
    const category = await sanityClient.fetch(categoryBySlugQuery, { slug });
    console.log("Category Data:", JSON.stringify(category, null, 2));
  } catch (error) {
    console.error("Error fetching category:", error);
  }
}

inspect();
