import { defineType, defineField } from "sanity";

export const localeString = defineType({
  name: "localeString",
  title: "نص مترجم",
  type: "object",
  fields: [
    defineField({
      name: "ar",
      title: "العربية",
      type: "string",
    }),
    defineField({
      name: "en",
      title: "English",
      type: "string",
    }),
  ],
});