import { defineType, defineField } from "sanity";
import { Package } from "lucide-react";

export const product = defineType({
  name: "product",
  title: "Product",
  description: "Manage product catalog items, specifications, and media.",
  type: "document",
  icon: Package,
  fields: [
    defineField({
      name: "title",
      title: "Product Title",
      type: "localeString",
      description: "The name of the product in English and Arabic.",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "Unique URL identifier generated from the English title.",
      options: {
        source: "title.en",
        maxLength: 96,
      },
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "localeText",
      description: "A detailed overview of the product's features and benefits.",
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      description: "Select the primary category this product belongs to.",
      to: [{ type: "category" }],
    }),
    defineField({
      name: "brand",
      title: "Brand",
      type: "reference",
      description: "The manufacturer or brand of the product.",
      to: [{ type: "brand" }],
    }),
    defineField({
      name: "warrantyMonths",
      title: "Warranty Duration (Months)",
      type: "number",
      description: "The number of months the product is covered under warranty.",
    }),
    defineField({
      name: "media",
      title: "Product Media",
      type: "object",
      description: "Images and videos for the product listing.",
      fields: [
        defineField({
          name: "thumbnail",
          title: "Main Thumbnail",
          type: "image",
          description: "The primary image shown in search results and catalogs.",
          options: { hotspot: true },
        }),
        defineField({
          name: "gallery",
          title: "Image Gallery",
          type: "array",
          description: "Additional images showcasing the product.",
          of: [{ type: "image", options: { hotspot: true } }],
          options: { layout: "grid" },
        }),
        defineField({
          name: "videoUrl",
          title: "Video Demo URL",
          type: "url",
          description: "Link to a YouTube or Vimeo video demonstrating the product.",
        }),
      ],
    }),
    defineField({
      name: "specifications",
      title: "Product Specifications",
      type: "array",
      description: "Key technical details (e.g., 'Resolution: 1440dpi').",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "name", title: "Specification Name", type: "localeString" }),
            defineField({ name: "value", title: "Specification Value", type: "localeString" }),
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {
      titleEn: "title.en",
      titleAr: "title.ar",
      categoryTitle: "category.title.en",
      categorySlug: "category.slug.current",
      media: "media.thumbnail",
    },
    prepare({ titleEn, titleAr, categoryTitle, categorySlug, media }) {
      const categoryLogos: Record<string, string> = {
        "acrylic-foam-sheets": "📄",
        "advertising-materials": "📢",
        "digital-printing-materials": "🎨",
        machines: "⚙️",
        printers: "🖨️",
        "printers-supplies": "💧",
        screens: "🖥️",
      };

      const categoryEmoji = categoryLogos[categorySlug] || "📦";

      return {
        title: titleEn || titleAr || "Untitled Product",
        subtitle: `${categoryEmoji} ${categoryTitle || "No Category"}`,
        media: media || (categoryEmoji as any),
      };
    },
  },
  groups: [],
});
