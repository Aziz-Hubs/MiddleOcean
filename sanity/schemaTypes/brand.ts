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
      description: "The name of the brand (e.g., 'Mimaki', '3M').",
    }),
    defineField({
      name: "isGeneric",
      title: "Is Generic Brand?",
      type: "boolean",
      description: "Flag to indicate if this is a generic or unbranded item.",
    }),
    defineField({
      name: "logo",
      title: "Brand Logo",
      type: "image",
      description: "Official logo of the brand.",
      options: {
        hotspot: true,
      },
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "logo",
    },
  },
});
