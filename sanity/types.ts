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
