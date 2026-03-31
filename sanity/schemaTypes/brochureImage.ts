import { defineType, defineField } from "sanity";
import { Image } from "lucide-react";

export const brochureImage = defineType({
  name: "brochureImage",
  title: "Brochure Image",
  type: "object",
  icon: Image,
  fields: [
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      description: "High-resolution image for PDF brochure.",
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "localeString",
      description: "Short title for this image (EN/AR).",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "localeText",
      description: "Detailed description for the brochure (EN/AR).",
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
        title: titleAr || titleEn || "Untitled",
        subtitle: titleAr ? titleEn : undefined,
        media,
      };
    },
  },
});