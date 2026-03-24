import { defineType, defineField } from "sanity";
import { Layers } from "lucide-react";

export const category = defineType({
  name: "category",
  title: "Category",
  description: "Organize products into logical categories (e.g., Printers, Acrylic Sheets).",
  type: "document",
  icon: Layers,
  fields: [
    defineField({
      name: "title",
      title: "Category Title",
      type: "localeString",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title.en",
        maxLength: 96,
      },
    }),
    defineField({
      name: "image",
      title: "Category Cover Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
  ],
  groups: [],
});
