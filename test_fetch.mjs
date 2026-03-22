import { createClient } from "@sanity/client";

const sanityClient = createClient({
  projectId: "hn27pyms",
  dataset: "production",
  useCdn: false,
  apiVersion: "2024-03-14",
});

async function test() {
    const productsCount = await sanityClient.fetch(`count(*[_type == "product"])`);
    console.log("Total Products:", productsCount);

    const products = await sanityClient.fetch(`*[_type == "product"] | order(_createdAt desc, _id desc) [0...12]`);
    console.log("Fetched Products Length:", products.length);
    console.log("Fetched Products Slugs:", products.map(p => p.slug?.current));
}

test();
