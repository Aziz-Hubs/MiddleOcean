import { defineType, defineField } from "sanity";

export const category = defineType({
  name: "category",
  title: "Category",
  type: "document",
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
});
