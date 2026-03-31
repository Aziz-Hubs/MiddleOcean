import { createClient } from "@sanity/client";

export const sanityClient = createClient({
  projectId: "hn27pyms",
  dataset: "production",
  useCdn: true,
  apiVersion: "2025-02-19",
});