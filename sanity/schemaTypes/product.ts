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
      description: "Product name (EN/AR). اسم المنتج باللغتين العربية والإنجليزية.",
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
      name: "description",
      title: "Description",
      type: "localeText",
      description: "Detailed overview. وصف تفصيلي للمنتج ومميزاته.",
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      description: "Main category. القسم الرئيسي الذي ينتمي إليه المنتج.",
      to: [{ type: "category" }],
    }),
    defineField({
      name: "brand",
      title: "Brand",
      type: "reference",
      description: "Manufacturer. العلامة التجارية أو الشركة المصنعة.",
      to: [{ type: "brand" }],
    }),
    defineField({
      name: "warrantyMonths",
      title: "Warranty (Months)",
      type: "number",
      description: "Months of coverage. عدد أشهر الضمان.",
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
      name: "brochureImages",
      title: "Brochure Images",
      type: "array",
      description: "Images dedicated for downloadable PDF brochure (3×2 grid, max 6).",
      of: [{ type: "brochureImage" }],
      validation: (Rule) => Rule.max(6),
      options: { layout: "grid" },
    }),
    defineField({
      name: "specifications",
      title: "Technical Specs",
      type: "array",
      description: "Technical details. المواصفات الفنية (مثلاً: الدقة، الوزن).",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "name",
              title: "Property",
              type: "localeString",
              description: "E.g. 'Resolution'. اسم الخاصية.",
            }),
            defineField({
              name: "value",
              title: "Value",
              type: "localeString",
              description: "E.g. '1440 dpi'. قيمة الخاصية.",
            }),
          ],
          preview: {
            select: {
              title: "name.ar",
              subtitle: "name.en",
            },
          },
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
        media: media || (categoryEmoji as string),
      };
    },
  },
  groups: [],
});
