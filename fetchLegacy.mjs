import fs from 'fs';

async function fetchProducts() {
  console.log("Fetching products from WP REST API...");
  try {
    const res = await fetch("https://middleocean.jo/wp-json/wp/v2/product?per_page=100");
    const products = await res.json();
    
    console.log(`Fetched ${products.length} products.`);
    
    // Map WP categories
    const catRes = await fetch("https://middleocean.jo/wp-json/wp/v2/product_cat?per_page=100");
    const categories = await catRes.json();
    const catMap = categories.reduce((acc, cat) => {
      acc[cat.id] = cat.name;
      return acc;
    }, {});

    const mapped = products.map(p => ({
      id: p.id,
      slug: p.slug,
      title: p.title.rendered,
      categories: p.product_cat.map(id => catMap[id]),
      content: p.content.rendered,
      excerpt: p.excerpt.rendered,
      featured_media: p.featured_media
    }));

    fs.writeFileSync("legacy_products.json", JSON.stringify(mapped, null, 2));
    console.log("Successfully wrote legacy_products.json with length:", mapped.length);

  } catch (err) {
    console.error("Error fetching products:", err);
  }
}

fetchProducts();
