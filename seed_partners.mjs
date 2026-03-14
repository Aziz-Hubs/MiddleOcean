import { createClient } from '@sanity/client';
import 'dotenv/config';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "hn27pyms",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  useCdn: false,
  apiVersion: '2024-03-12',
  token: process.env.SANITY_AUTH_TOKEN || "skDLhZXax2q0aTNWdmiKTTTIl3U2HUL8Vt0INxdjFLmD07vhfG5vIXxbCEUvMf4kx34YLyGGyrwjyp9EaLepVlzAATrtmMZMuampciijeRkDTcgm193h2crGOVHh9hhCgQ269bBIYEPSJcJYnOP1GPxIKICLZCKhQyxjd2p6L0FpovqSJhKf",
});

const partners = [
  "OceanTeck",
  "OceanJett",
  "FLORA",
  "HP",
  "Epson",
  "Sharawy",
  "Media Maker",
  "Free Hand",
  "Daleel",
  "Awwya2",
  "Art Medniu",
  "ALwan",
  "Abd AL bary",
  "Sultan",
  "Vision"
];

async function seed() {
  console.log(`Seeding ${partners.length} partners...`);
  for (const name of partners) {
    try {
      const exists = await client.fetch(`*[_type == "partner" && name == $name][0]`, { name });
      if (exists) {
        console.log(`Partner already exists: ${name}. Skipping...`);
      } else {
        const res = await client.create({
          _type: 'partner',
          name: name
        });
        console.log(`✅ Seeded: ${name} (${res._id})`);
      }
    } catch (err) {
      console.error(`❌ Failed to seed ${name}:`, err.message);
    }
  }
  console.log("Seeding Complete!");
}

seed();
