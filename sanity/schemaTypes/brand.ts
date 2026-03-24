import { defineType, defineField } from "sanity";
import { Award } from "lucide-react";

export const brand = defineType({
  name: "brand",
  title: "Brand",
  description: "Manage product brands and their logos.",
  type: "document",
  icon: Award,
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
