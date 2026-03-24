import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./sanity/schemaTypes";
import { structure } from "./sanity/deskStructure";

export default defineConfig({
  name: "default",
  title: "Middle Ocean",
  projectId: "hn27pyms",
  dataset: "production",
  basePath: "/studio",
  plugins: [structureTool({ structure })],
  schema: {
    types: schemaTypes,
  },
});