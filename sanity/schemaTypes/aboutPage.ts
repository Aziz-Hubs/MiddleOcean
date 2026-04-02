import { defineType, defineField } from "sanity";
import { FileText } from "lucide-react";

export const aboutPage = defineType({
  name: "aboutPage",
  title: "About Page",
  description: "About Us page content (singleton document)",
  type: "document",
  icon: FileText,
  fields: [
    // Hero Section
    defineField({
      name: "hero",
      title: "Hero Section",
      type: "object",
      description: "Main hero banner at top of page",
      fields: [
        defineField({
          name: "title",
          title: "Title",
          type: "localeString",
          description: "Main heading for the about page",
        }),
        defineField({
          name: "subtitle",
          title: "Subtitle",
          type: "localeString",
          description: "Supporting text below the title",
        }),
        defineField({
          name: "image",
          title: "Hero Image",
          type: "image",
          description: "Background or featured image for hero section",
          options: { hotspot: true },
        }),
      ],
    }),

    // History Section
    defineField({
      name: "history",
      title: "Company History",
      type: "object",
      description: "The story of the company's journey",
      fields: [
        defineField({
          name: "title",
          title: "Section Title",
          type: "localeString",
          initialValue: { en: "Our Story", ar: "قصتنا" },
        }),
        defineField({
          name: "content",
          title: "History Content",
          type: "localeText",
          description: "Detailed company history (supports line breaks)",
        }),
      ],
    }),

    // Mission & Vision Section
    defineField({
      name: "missionVision",
      title: "Mission & Vision",
      type: "object",
      description: "Company mission and vision statements",
      fields: [
        defineField({
          name: "missionTitle",
          title: "Mission Title",
          type: "localeString",
          initialValue: { en: "Our Mission", ar: "مهمتنا" },
        }),
        defineField({
          name: "mission",
          title: "Mission Statement",
          type: "localeText",
          description: "What the company aims to achieve",
        }),
        defineField({
          name: "visionTitle",
          title: "Vision Title",
          type: "localeString",
          initialValue: { en: "Our Vision", ar: "رؤيتنا" },
        }),
        defineField({
          name: "vision",
          title: "Vision Statement",
          type: "localeText",
          description: "Where the company aspires to be",
        }),
      ],
    }),

    // Values Section
    defineField({
      name: "values",
      title: "Our Values",
      type: "object",
      description: "Core values and differentiators",
      fields: [
        defineField({
          name: "sectionTitle",
          title: "Section Title",
          type: "localeString",
          initialValue: { en: "Our Values", ar: "قيمنا" },
        }),
        defineField({
          name: "items",
          title: "Value Items",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                defineField({
                  name: "title",
                  title: "Value Title",
                  type: "localeString",
                }),
                defineField({
                  name: "description",
                  title: "Description",
                  type: "localeString",
                }),
                defineField({
                  name: "icon",
                  title: "Icon Name",
                  type: "string",
                  description: "Lucide icon name (e.g., 'Shield', 'Users', 'Award', 'Target', 'Heart', 'Zap', 'Globe', 'Leaf')",
                  options: {
                    list: [
                      { title: "Shield (Trust)", value: "Shield" },
                      { title: "Users (Team)", value: "Users" },
                      { title: "Award (Excellence)", value: "Award" },
                      { title: "Target (Focus)", value: "Target" },
                      { title: "Heart (Passion)", value: "Heart" },
                      { title: "Zap (Speed/Innovation)", value: "Zap" },
                      { title: "Globe (Global)", value: "Globe" },
                      { title: "Leaf (Sustainability)", value: "Leaf" },
                      { title: "Lightbulb (Innovation)", value: "Lightbulb" },
                      { title: "Handshake (Partnership)", value: "Handshake" },
                      { title: "Star (Quality)", value: "Star" },
                      { title: "CheckCircle (Reliability)", value: "CheckCircle" },
                      { title: "TrendingUp (Growth)", value: "TrendingUp" },
                      { title: "Settings (Technical)", value: "Settings" },
                      { title: "Headphones (Support)", value: "Headphones" },
                    ],
                  },
                }),
              ],
              preview: {
                select: {
                  title: "title.en",
                  subtitle: "description.en",
                },
              },
            },
          ],
          options: { layout: "grid" },
        }),
      ],
    }),

    // Team Section
    defineField({
      name: "team",
      title: "Team Members",
      type: "object",
      description: "Leadership and team members",
      fields: [
        defineField({
          name: "sectionTitle",
          title: "Section Title",
          type: "localeString",
          initialValue: { en: "Our Team", ar: "فريقنا" },
        }),
        defineField({
          name: "members",
          title: "Team Members",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                defineField({
                  name: "name",
                  title: "Full Name",
                  type: "string",
                  description: "Person's full name",
                }),
                defineField({
                  name: "role",
                  title: "Role/Title",
                  type: "localeString",
                  description: "Job title or position",
                }),
                defineField({
                  name: "bio",
                  title: "Bio",
                  type: "localeText",
                  description: "Brief biography",
                }),
                defineField({
                  name: "photo",
                  title: "Photo",
                  type: "image",
                  options: { hotspot: true },
                }),
                defineField({
                  name: "order",
                  title: "Display Order",
                  type: "number",
                  description: "Lower numbers appear first",
                  initialValue: 0,
                }),
              ],
              preview: {
                select: {
                  title: "name",
                  subtitle: "role.en",
                  media: "photo",
                },
              },
            },
          ],
          options: { layout: "grid" },
        }),
      ],
    }),

    // Timeline Section
    defineField({
      name: "timeline",
      title: "Timeline & Milestones",
      type: "object",
      description: "Company milestones and future goals",
      fields: [
        defineField({
          name: "sectionTitle",
          title: "Section Title",
          type: "localeString",
          initialValue: { en: "Our Journey", ar: "مسيرتنا" },
        }),
        defineField({
          name: "events",
          title: "Timeline Events",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                defineField({
                  name: "year",
                  title: "Year",
                  type: "number",
                  description: "Year of the milestone or goal",
                }),
                defineField({
                  name: "title",
                  title: "Event Title",
                  type: "localeString",
                }),
                defineField({
                  name: "description",
                  title: "Description",
                  type: "localeString",
                }),
                defineField({
                  name: "isFuture",
                  title: "Future Goal?",
                  type: "boolean",
                  description: "Check if this is a future goal (displays differently)",
                  initialValue: false,
                }),
              ],
              preview: {
                select: {
                  title: "title.en",
                  subtitle: "year",
                },
              },
            },
          ],
          options: { layout: "grid" },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "hero.title.en",
      subtitle: "hero.subtitle.en",
    },
    prepare({ title, subtitle }) {
      return {
        title: title || "About Page",
        subtitle: subtitle || "Edit the about us page content",
      };
    },
  },
});
