import { defineType, defineField } from "sanity";
import { Star } from "lucide-react";

/**
 * productReview schema
 * 
 * Represents a curated customer review for a product.
 * Added by the Middle Ocean team only — no public review submission.
 * 
 * All user-facing text fields use localized en/ar objects so they can be 
 * displayed correctly in both LTR (English) and RTL (Arabic) contexts.
 */
export const productReview = defineType({
  name: "productReview",
  title: "Product Review",
  description: "Curated customer reviews for specific products.",
  type: "document",
  icon: Star,

  fields: [
    // ── Company Information ──────────────────────────────────────────
    defineField({
      name: "companyName",
      title: "Company Name",
      type: "localeString",
      description: "Name of the client company in English and Arabic.",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "companyLogo",
      title: "Company Logo",
      type: "image",
      description: "Logo of the client company. Use a square or horizontal logo for best results (SVG or PNG preferred).",
      options: {
        hotspot: true,
      },
    }),

    // ── Product Reference ────────────────────────────────────────────
    defineField({
      name: "product",
      title: "Product",
      type: "reference",
      to: [{ type: "product" }],
      description: "The specific product this review is associated with.",
      validation: (Rule) => Rule.required(),
    }),

    // ── The Review Content ───────────────────────────────────────────
    defineField({
      name: "reviewText",
      title: "Review",
      type: "localeText",
      description: "The actual review feedback in both English and Arabic.",
      validation: (Rule) => Rule.required(),
    }),

    // ── Rating (1-5) ─────────────────────────────────────────────────
    defineField({
      name: "rating",
      title: "Star Rating",
      type: "number",
      description: "Customer satisfaction rating from 1 (poor) to 5 (excellent).",
      validation: (Rule) => Rule.required().min(1).max(5).integer(),
      initialValue: 5,
    }),

    // ── Reviewer Name ────────────────────────────────────────────────
    defineField({
      name: "reviewerName",
      title: "Reviewer Name",
      type: "localeString",
      description: "Name and professional title of the individual reviewer.",
    }),

    // ── Date ─────────────────────────────────────────────────────────
    defineField({
      name: "date",
      title: "Review Date",
      type: "date",
      description: "The date when the review was originally given.",
      options: {
        dateFormat: "YYYY-MM-DD",
      },
      validation: (Rule) => Rule.required(),
    }),

    // ── Published Status ─────────────────────────────────────────────
    defineField({
      name: "published",
      title: "Published",
      type: "boolean",
      description: "Toggle on to make this review visible on the public website.",
      initialValue: true,
    }),
  ],

  preview: {
    select: {
      companyEn: "companyName.en",
      companyAr: "companyName.ar",
      productTitle: "product.title.en",
      rating: "rating",
      media: "companyLogo",
    },
    prepare({ companyEn, companyAr, productTitle, rating, media }) {
      const stars = "★".repeat(rating || 0) + "☆".repeat(5 - (rating || 0));
      return {
        title: companyEn || companyAr || "Unnamed Company",
        subtitle: `${stars} — ${productTitle || "Unknown Product"}`,
        media,
      };
    },
  },

  orderings: [
    {
      title: "Newest First",
      name: "dateDesc",
      by: [{ field: "date", direction: "desc" }],
    },
    {
      title: "Highest Rating",
      name: "ratingDesc",
      by: [{ field: "rating", direction: "desc" }],
    },
  ],
});
