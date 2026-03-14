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

async function run() {
  const ids = [
    "rjUlnNRPecJpvtSZ0AR4Hk",
    "rjUlnNRPecJpvtSZ0AQgFQ",
    "ATPlxTHamnhSxmcP0F6O2E",
    "rjUlnNRPecJpvtSZ0AQdm8"
  ];
  const products = await client.fetch(`*[_id in $ids]`, { ids });
  fs.writeFileSync("inspect_anomalies.json", JSON.stringify(products, null, 2));
  console.log("Wrote inspect_anomalies.json");
}

run();
