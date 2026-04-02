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
  brochureImages?: SanityBrochureImage[];
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

// About Page Types
export interface SanityLocaleString {
  en: string;
  ar: string;
}

export interface SanityLocaleText {
  en: string;
  ar: string;
}

export interface SanityAboutPageHero {
  title: SanityLocaleString;
  subtitle: SanityLocaleString;
  image?: string;
}

export interface SanityAboutPageHistory {
  title: SanityLocaleString;
  content: SanityLocaleText;
}

export interface SanityAboutPageMissionVision {
  missionTitle: SanityLocaleString;
  mission: SanityLocaleText;
  visionTitle: SanityLocaleString;
  vision: SanityLocaleText;
}

export interface SanityAboutPageValueItem {
  _key: string;
  title: SanityLocaleString;
  description: SanityLocaleString;
  icon: string;
}

export interface SanityAboutPageValues {
  sectionTitle: SanityLocaleString;
  items: SanityAboutPageValueItem[];
}

export interface SanityAboutPageTeamMember {
  _key: string;
  name: string;
  role: SanityLocaleString;
  bio: SanityLocaleText;
  photo?: string;
  order: number;
}

export interface SanityAboutPageTeam {
  sectionTitle: SanityLocaleString;
  members: SanityAboutPageTeamMember[];
}

export interface SanityAboutPageTimelineEvent {
  _key: string;
  year: number;
  title: SanityLocaleString;
  description: SanityLocaleString;
  isFuture: boolean;
}

export interface SanityAboutPageTimeline {
  sectionTitle: SanityLocaleString;
  events: SanityAboutPageTimelineEvent[];
}

export interface SanityAboutPage {
  _id: string;
  _type: "aboutPage";
  hero: SanityAboutPageHero;
  history: SanityAboutPageHistory;
  missionVision: SanityAboutPageMissionVision;
  values: SanityAboutPageValues;
  team: SanityAboutPageTeam;
  timeline: SanityAboutPageTimeline;
}
