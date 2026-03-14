import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

export default defineConfig({
  name: "default",
  title: "Middle Ocean",
  projectId: "hn27pyms",
  dataset: "production",
  plugins: [structureTool()],
  schema: {
    types: [],
  },
});