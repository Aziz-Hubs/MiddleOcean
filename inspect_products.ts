import { sanityClient } from "./sanity/client.js";
import { allProductsPagedQuery } from "./sanity/queries.ts";

const start = 0;
const end = 5;

async function inspect() {
  try {
    const products = await sanityClient.fetch(allProductsPagedQuery, { start, end });
    console.log("Products Titles:", JSON.stringify(products.map(p => ({ id: p._id, title: p.title })), null, 2));
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}

inspect();
