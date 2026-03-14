import { createClient } from '@sanity/client';
import fs from 'fs';
import 'dotenv/config';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  apiVersion: '2024-03-12',
  token: process.env.SANITY_AUTH_TOKEN || "skDLhZXax2q0aTNWdmiKTTTIl3U2HUL8Vt0INxdjFLmD07vhfG5vIXxbCEUvMf4kx34YLyGGyrwjyp9EaLepVlzAATrtmMZMuampciijeRkDTcgm193h2crGOVHh9hhCgQ269bBIYEPSJcJYnOP1GPxIKICLZCKhQyxjd2p6L0FpovqSJhKf",
});

async function audit() {
  console.log("Fetching all products...");
  const products = await client.fetch(`
    *[_type == "product"]{
      _id,
      "titleEn": title.en,
      "titleAr": title.ar,
      "slug": slug.current,
      "category": category->slug.current,
      "categoryName": category->title.en,
      specifications
    } | order(category asc, titleEn asc)
  `);

  console.log(`Found ${products.length} products.`);

  // Let's do some basic grouping and anomaly detection
  const report = {
    total: products.length,
    byCategory: {},
    anomalies: []
  };

  for (const p of products) {
    // Group by category
    const cat = p.category || "UNCATEGORIZED";
    if (!report.byCategory[cat]) report.byCategory[cat] = 0;
    report.byCategory[cat]++;

    // Anomaly checks
    let issues = [];
    
    // 1. Check title casing
    if (p.titleEn && p.titleEn.toUpperCase() === p.titleEn) {
      issues.push("Title is ALL CAPS");
    }
    
    // 2. Check for empty specs
    if (!p.specifications || p.specifications.length === 0) {
      issues.push("No specifications");
    } else {
      // 3. Check for HTML artifacts in specs
      for (const spec of p.specifications) {
        if (spec.value?.en?.includes('<') || spec.value?.en?.includes('&')) {
          issues.push(`HTML artifact in spec: ${spec.name.en}`);
        }
        if (spec.name?.en?.toLowerCase().includes('strong') || spec.name?.en?.includes('<')) {
          issues.push(`HTML artifact in spec name: ${spec.name.en}`);
        }
      }
    }

    if (issues.length > 0) {
      report.anomalies.push({
        id: p._id,
        title: p.titleEn,
        category: p.category,
        issues
      });
    }
  }

  fs.writeFileSync("audit_report.json", JSON.stringify(report, null, 2));
  console.log(`Audit complete. Found ${report.anomalies.length} anomalous products.`);
  
  // Print summary
  console.log("\\n--- CATEGORIES ---");
  for (const [cat, count] of Object.entries(report.byCategory)) {
    console.log(`${cat}: ${count}`);
  }
}

audit().catch(console.error);
