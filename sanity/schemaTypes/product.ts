import { defineType, defineField } from "sanity";
import { Package } from "lucide-react";

export const product = defineType({
  name: "product",
  title: "المنتج",
  description: "إدارة منتجات الكتالوج والمواصفات والوسائط.",
  type: "document",
  icon: Package,
  fields: [
    defineField({
      name: "title",
      title: "اسم المنتج",
      type: "localeString",
      description: "اسم المنتج باللغتين العربية والإنجليزية.",
    }),
    defineField({
      name: "slug",
      title: "الرابط",
      type: "slug",
      description: "معرف الرابط الفريد يتم إنشاؤه تلقائياً.",
      options: {
        source: "title.en",
        maxLength: 96,
      },
    }),
    defineField({
      name: "description",
      title: "الوصف",
      type: "localeText",
      description: "وصف تفصيلي للمنتج ومميزاته.",
    }),
    defineField({
      name: "category",
      title: "القسم",
      type: "reference",
      description: "القسم الرئيسي الذي ينتمي إليه المنتج.",
      to: [{ type: "category" }],
    }),
    defineField({
      name: "brand",
      title: "العلامة التجارية",
      type: "reference",
      description: "العلامة التجارية أو الشركة المصنعة.",
      to: [{ type: "brand" }],
    }),
    defineField({
      name: "warrantyMonths",
      title: "الضمان (أشهر)",
      type: "number",
      description: "عدد أشهر الضمان.",
    }),
    defineField({
      name: "media",
      title: "وسائط المنتج",
      type: "object",
      description: "الصور والفيديوهات لصفحة المنتج.",
      fields: [
        defineField({
          name: "thumbnail",
          title: "الصورة الرئيسية",
          type: "image",
          description: "الصورة الرئيسية التي تظهر في نتائج البحث والكتالوج.",
          options: { hotspot: true },
        }),
        defineField({
          name: "gallery",
          title: "معرض الصور",
          type: "array",
          description: "صور إضافية تعرض المنتج.",
          of: [{ type: "image", options: { hotspot: true } }],
          options: { layout: "grid" },
        }),
        defineField({
          name: "videoUrl",
          title: "رابط الفيديو",
          type: "url",
          description: "رابط فيديو يوتيوب أو فيميو لعرض المنتج.",
        }),
      ],
    }),
    defineField({
      name: "brochureImages",
      title: "صور الكتالوج",
      type: "array",
      description: "صور مخصصة لملف PDF القابل للتحميل (شبكة3×2، حدأقصى6 صور).",
      of: [{ type: "brochureImage" }],
      validation: (Rule) => Rule.max(6),
      options: { layout: "grid" },
    }),
    defineField({
      name: "specifications",
      title: "المواصفات الفنية",
      type: "array",
      description: "المواصفات الفنية للمنتج (مثلاً: الدقة، الوزن).",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "name",
              title: "الخاصية",
              type: "localeString",
              description: "اسم الخاصية (مثلاً: 'الدقة').",
            }),
            defineField({
              name: "value",
              title: "القيمة",
              type: "localeString",
              description: "قيمة الخاصية (مثلاً: '1440 dpi').",
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
        title: titleAr || titleEn || "منتج بدون اسم",
        subtitle: `${categoryEmoji} ${categoryTitle || "بدون قسم"}`,
        media: media || (categoryEmoji as string),
      };
    },
  },
  groups: [],
});