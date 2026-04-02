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
      name: "description",
      title: "الوصف",
      type: "localeString",
      description: "وصف القسم باللغتين العربية والإنجليزية.",
    }),
    defineField({
      name: "icon",
      title: "الأيقونة",
      type: "string",
      description: "اسم أيقونة Lucide المستخدمة للقسم (مثال: Printer, Layers, Box).",
      options: {
        list: [
          { title: "Layers", value: "Layers" },
          { title: "Printer", value: "Printer" },
          { title: "Box", value: "Box" },
          { title: "Monitor", value: "Monitor" },
          { title: "Image", value: "Image" },
          { title: "Package", value: "Package" },
          { title: "Settings", value: "Settings" },
          { title: "Megaphone", value: "Megaphone" },
          { title: "PenTool", value: "PenTool" },
        ],
      },
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