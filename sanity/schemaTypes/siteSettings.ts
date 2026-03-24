import { defineType } from "sanity";
import { Settings } from "lucide-react";

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  description: 'Global site configuration, contact details, and FAQs.',
  type: 'document',
  icon: Settings,
  fields: [
    {
      name: 'title',
      title: 'Site Title',
      type: 'string',
    },
    {
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
      description: 'Format with country code, e.g., +9627...',
    },
    {
      name: 'email',
      title: 'Email Address',
      type: 'string',
    },
    {
      name: 'whatsapp',
      title: 'WhatsApp Number',
      type: 'string',
      description: 'Format with country code, e.g., +9627...',
    },
    {
      name: 'address',
      title: 'Physical Address',
      type: 'localeText',
    },
    {
      name: 'mapCoordinates',
      title: 'Map Coordinates',
      type: 'object',
      fields: [
        { name: 'lat', title: 'Latitude', type: 'number' },
        { name: 'lng', title: 'Longitude', type: 'number' },
      ],
    },
    {
      name: 'socialLinks',
      title: 'Social Links',
      type: 'object',
      fields: [
        {
          name: 'facebook',
          title: 'Facebook URL',
          type: 'url',
        },
        {
          name: 'instagram',
          title: 'Instagram URL',
          type: 'url',
        },
        {
          name: 'linkedin',
          title: 'LinkedIn URL',
          type: 'url',
        },
        {
          name: 'twitter',
          title: 'Twitter/X URL',
          type: 'url',
        },
      ],
    },
    {
      name: 'faqs',
      title: 'Frequently Asked Questions',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'question',
              title: 'Question',
              type: 'localeString',
            },
            {
              name: 'answer',
              title: 'Answer',
              type: 'localeText',
            },
          ],
        },
      ],
    },
  ],
});
