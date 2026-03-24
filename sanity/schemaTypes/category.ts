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
      description: "The name of the category in English and Arabic (e.g., 'Printers' / 'طابعات').",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "Unique identifier used in the URL. Generated from the English title.",
      options: {
        source: "title.en",
        maxLength: 96,
      },
    }),
    defineField({
      name: "image",
      title: "Category Cover Image",
      type: "image",
      description: "The hero image representing this category on the website.",
      options: {
        hotspot: true,
      },
    }),
  ],
  preview: {
    select: {
      titleEn: "title.en",
      titleAr: "title.ar",
      media: "image",
    },
    prepare({ titleEn, titleAr, media }) {
      return {
        title: titleEn || titleAr || "Untitled Category",
        subtitle: titleAr ? `AR: ${titleAr}` : "No Arabic Title",
        media,
      };
    },
  },
  groups: [],
});
