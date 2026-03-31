import { defineType, defineField } from "sanity";
import { Image } from "lucide-react";

export const brochureImage = defineType({
  name: "brochureImage",
  title: "صورة الكتالوج",
  type: "object",
  icon: Image,
  fields: [
    defineField({
      name: "image",
      title: "الصورة",
      type: "image",
      description: "صورة عالية الدقة لملف PDF.",
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "title",
      title: "العنوان",
      type: "localeString",
      description: "عنوان مختصر للصورة باللغتين.",
    }),
    defineField({
      name: "description",
      title: "الوصف",
      type: "localeText",
      description: "وصف تفصيلي للصورة باللغتين.",
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
        title: titleAr || titleEn || "بدون عنوان",
        subtitle: titleAr ? titleEn : undefined,
        media,
      };
    },
  },
});