import { defineType, defineField } from "sanity";

export const brand = defineType({
  name: "brand",
  title: "Brand",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Brand Name",
      type: "string",
    }),
    defineField({
      name: "isGeneric",
      title: "Is Generic Brand?",
      type: "boolean",
    }),
    defineField({
      name: "logo",
      title: "Brand Logo",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
  ],
});
