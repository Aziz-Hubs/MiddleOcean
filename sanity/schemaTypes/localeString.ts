import { defineType, defineField } from "sanity";

export const localeString = defineType({
  name: "localeString",
  title: "Localized String",
  type: "object",
  fields: [
    defineField({
      name: "en",
      title: "English",
      type: "string",
    }),
    defineField({
      name: "ar",
      title: "Arabic",
      type: "string",
    }),
  ],
});
