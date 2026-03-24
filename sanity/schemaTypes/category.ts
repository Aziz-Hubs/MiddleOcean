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
      description: "Category name (EN/AR). اسم القسم باللغتين العربية والإنجليزية.",
    }),
    defineField({
      name: "slug",
      title: "Slug (URL)",
      type: "slug",
      description: "Unique URL ID. معرف الرابط الفريد يتم إنشاؤه تلقائياً.",
      options: {
        source: "title.en",
        maxLength: 96,
      },
    }),
    defineField({
      name: "image",
      title: "Category Image",
      type: "image",
      description: "Hero image. صورة القسم الرئيسية التي تظهر بالموقع.",
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
