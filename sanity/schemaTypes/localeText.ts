import { defineType, defineField } from "sanity";

export const localeText = defineType({
  name: "localeText",
  title: "نص طويل مترجم",
  type: "object",
  fields: [
    defineField({
      name: "ar",
      title: "العربية",
      type: "text",
    }),
    defineField({
      name: "en",
      title: "English",
      type: "text",
    }),
  ],
});