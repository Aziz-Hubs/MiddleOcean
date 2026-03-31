import { defineType, defineField } from "sanity";
import { Award } from "lucide-react";

export const brand = defineType({
  name: "brand",
  title: "العلامة التجارية",
  description: "إدارة العلامات التجارية للمنتجات وشعاراتها.",
  type: "document",
  icon: Award,
  fields: [
    defineField({
      name: "title",
      title: "اسم العلامة",
      type: "string",
      description: "اسم العلامة التجارية (مثلاً: Mimaki, 3M, Generic).",
    }),
    defineField({
      name: "isGeneric",
      title: "علامة عامة؟",
      type: "boolean",
      description: "هل المنتج بدون علامة تجارية معروفة؟",
    }),
    defineField({
      name: "logo",
      title: "شعار العلامة",
      type: "image",
      description: "شعار العلامة التجارية الأصلي.",
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