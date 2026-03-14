import { createClient } from "@sanity/client";

export const sanityClient = createClient({
  projectId: "hn27pyms",
  dataset: "production",
  useCdn: false,
  apiVersion: "2024-03-14",
});