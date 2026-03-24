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
      name: "description",
      title: "Description",
      type: "localeText",
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
    }),
    defineField({
      name: "brand",
      title: "Brand",
      type: "reference",
      to: [{ type: "brand" }],
    }),
    defineField({
      name: "warrantyMonths",
      title: "Warranty Duration (Months)",
      type: "number",
    }),
    defineField({
      name: "media",
      title: "Product Media",
      type: "object",
      fields: [
        defineField({
          name: "thumbnail",
          title: "Main Thumbnail",
          type: "image",
          options: { hotspot: true },
        }),
        defineField({
          name: "gallery",
          title: "Image Gallery",
          type: "array",
          of: [{ type: "image", options: { hotspot: true } }],
          options: { layout: "grid" },
        }),
        defineField({
          name: "videoUrl",
          title: "Video Demo URL",
          type: "url",
        }),
      ],
    }),
    defineField({
      name: "specifications",
      title: "Product Specifications",
      type: "array",
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
  groups: [],
});
