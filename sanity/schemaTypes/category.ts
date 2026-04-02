import { defineType, defineField } from "sanity";
import { Layers } from "lucide-react";

export const category = defineType({
  name: "category",
  title: "القسم",
  description: "تنظيم المنتجات في أقسام منطقية (مثلاً: طابعات، ألواح أكريليك).",
  type: "document",
  icon: Layers,
  fields: [
    defineField({
      name: "title",
      title: "اسم القسم",
      type: "localeString",
      description: "اسم القسم باللغتين العربية والإنجليزية.",
    }),
    defineField({
      name: "slug",
      title: "الرابط",
      type: "slug",
      description: "معرف الرابط الفريد يتم إنشاؤه تلقائياً من الاسم الإنجليزي.",
      options: {
        source: "title.en",
        maxLength: 96,
      },
    }),
    defineField({
      name: "image",
      title: "صورة القسم",
      type: "image",
      description: "الصورة الرئيسية للقسم التي تظهر في الموقع.",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "brochureImages",
      title: "صور الكتالوج الافتراضية",
      type: "array",
      description: "صور الكتالوج الافتراضية للمنتجات في هذا القسم. تستخدم عند عدم وجود صور خاصة بالمنتج في بياناته.",
      of: [{ type: "brochureImage" }],
      validation: (Rule) => Rule.max(6),
      options: { layout: "grid" },
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
        title: titleAr || titleEn || "قسم بدون اسم",
        subtitle: titleAr ? titleEn : undefined,
        media,
      };
    },
  },
  groups: [],
});