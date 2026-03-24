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
      description: "Brand name. اسم العلامة التجارية (Mimaki, 3M,...).",
    }),
    defineField({
      name: "isGeneric",
      title: "Generic Brand?",
      type: "boolean",
      description: "Is it unbranded? هل الصنف بدون علامة تجارية معروفة؟",
    }),
    defineField({
      name: "logo",
      title: "Brand Logo",
      type: "image",
      description: "Logo image. شعار العلامة التجارية الأصلي.",
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
