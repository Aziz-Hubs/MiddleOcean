export interface SanityCategory {
  _id: string;
  title: {
    en: string;
    ar: string;
  };
  description: {
    en: string;
    ar: string;
  };
  icon: string;
  slug: {
    current: string;
  };
  image?: string;
}

export interface SanityBrochureImage {
  _key: string;
  image?: {
    asset: {
      url: string;
    };
  };
  title?: {
    en: string;
    ar: string;
  };
  description?: {
    en: string;
    ar: string;
  };
}

export interface SanityProduct {
  _id: string;
  title: { en: string; ar: string };
  description?: { en: string; ar: string };
  slug: { current: string };
  imageUrl?: string;
  warrantyMonths?: number;
  category?: {
    _id?: string;
    title: { en: string; ar: string };
    slug: { current: string };
  };
  brochureImages?: SanityBrochureImage[];
}
