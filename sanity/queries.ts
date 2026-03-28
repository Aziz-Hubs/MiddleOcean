export const categoryQuery = `*[_type == "category"]{
  _id,
  title,
  description,
  icon,
  slug,
  "image": image.asset->url
}`;

export const categoryBySlugQuery = `*[_type == "category" && slug.current == $slug][0]{
  _id,
  title,
  description,
  icon,
  slug,
  "image": image.asset->url
}`;

export const allProductsQuery = `*[_type == "product"] | order(_createdAt desc){
  _id,
  title,
  description,
  slug,
  category->{
    title,
    slug
  },
  brand->{
    title,
    "logoUrl": logo.asset->url
  },
  "imageUrl": media.thumbnail.asset->url,
  warrantyMonths
}`;

export const allProductsPagedQuery = `*[_type == "product"] | order(_createdAt desc, _id desc) [$start...$end]{
  _id,
  title,
  description,
  slug,
  category->{
    title,
    slug
  },
  brand->{
    title,
    "logoUrl": logo.asset->url
  },
  "imageUrl": media.thumbnail.asset->url,
  warrantyMonths
}`;

export const productsCountQuery = `count(*[_type == "product"])`;

export const productsByCategoryQuery = `*[_type == "product" && category->slug.current == $slug] | order(_createdAt desc){
  _id,
  title,
  description,
  slug,
  category->{
    title,
    slug
  },
  brand->{
    title,
    "logoUrl": logo.asset->url
  },
  "imageUrl": media.thumbnail.asset->url,
  warrantyMonths
}`;

export const productsByCategoryPagedQuery = `*[_type == "product" && category->slug.current == $slug] | order(_createdAt desc, _id desc) [$start...$end]{
  _id,
  title,
  description,
  slug,
  category->{
    title,
    slug
  },
  brand->{
    title,
    "logoUrl": logo.asset->url
  },
  "imageUrl": media.thumbnail.asset->url,
  warrantyMonths
}`;

export const productsByCategoryCountQuery = `count(*[_type == "product" && category->slug.current == $slug])`;

export const productBySlugQuery = `*[_type == "product" && slug.current == $slug][0]{
  _id,
  title,
  description,
  slug,
  category->{
    title,
    slug
  },
  brand->{
    title,
    "logoUrl": logo.asset->url
  },
  warrantyMonths,
  media {
    "thumbnailUrl": thumbnail.asset->url,
    "galleryUrls": gallery[].asset->url,
    videoUrl
  },
  specifications
}`;

// Reviews for a specific product, ordered newest first, only published
// Paginated: $start and $end are calculated server-side (2 per page)
export const productReviewsPagedQuery = `*[
  _type == "productReview" &&
  published == true &&
  references($productId)
] | order(date desc) [$start...$end]{
  _id,
  companyName,
  "companyLogoUrl": companyLogo.asset->url,
  reviewText,
  rating,
  reviewerName,
  date,
  product->{
    title,
    slug
  }
}`;

export const productReviewsCountQuery = `count(*[
  _type == "productReview" &&
  published == true &&
  references($productId)
])`;

export const siteSettingsQuery = `*[_type == "siteSettings"][0]{
  title,
  phone,
  email,
  whatsapp,
  address,
  mapCoordinates,
  socialLinks,
  faqs

}`;

// Search products with fuzzy matching - English version (default)
export const searchProductsQueryEn = `*[_type == "product" && (
  title.en match $searchTerm + "*" ||
  title.ar match $searchTerm + "*" ||
  description.en match $searchTerm + "*" ||
  description.ar match $searchTerm + "*" ||
  category->title.en match $searchTerm + "*" ||
  category->title.ar match $searchTerm + "*" ||
  brand->title match $searchTerm + "*"
)] | order(
  title.en match $searchTerm + "*" desc,
  title.ar match $searchTerm + "*" desc,
  category->title.en match $searchTerm + "*" desc,
  category->title.ar match $searchTerm + "*" desc,
  brand->title match $searchTerm + "*" desc,
  _createdAt desc
) [0...10]{
  _id,
  title,
  description,
  slug,
  category->{
    title,
    slug
  },
  brand->{
    title,
    "logoUrl": logo.asset->url
  },
  "imageUrl": media.thumbnail.asset->url,
  warrantyMonths
}`;

// Search products with fuzzy matching - Arabic version
export const searchProductsQueryAr = `*[_type == "product" && (
  title.en match $searchTerm + "*" ||
  title.ar match $searchTerm + "*" ||
  description.en match $searchTerm + "*" ||
  description.ar match $searchTerm + "*" ||
  category->title.en match $searchTerm + "*" ||
  category->title.ar match $searchTerm + "*" ||
  brand->title match $searchTerm + "*"
)] | order(
  title.ar match $searchTerm + "*" desc,
  title.en match $searchTerm + "*" desc,
  category->title.ar match $searchTerm + "*" desc,
  category->title.en match $searchTerm + "*" desc,
  brand->title match $searchTerm + "*" desc,
  _createdAt desc
) [0...10]{
  _id,
  title,
  description,
  slug,
  category->{
    title,
    slug
  },
  brand->{
    title,
    "logoUrl": logo.asset->url
  },
  "imageUrl": media.thumbnail.asset->url,
  warrantyMonths
}`;

// Get recent/popular products for empty search state
export const recentProductsQuery = `*[_type == "product"] | order(_createdAt desc) [0...6]{
  _id,
  title,
  description,
  slug,
  category->{
    title,
    slug
  },
  brand->{
    title,
    "logoUrl": logo.asset->url
  },
  "imageUrl": media.thumbnail.asset->url,
  warrantyMonths
}`;

// Get product names for search placeholder cycling
export const productNamesForPlaceholderQuery = `*[_type == "product" && defined(title.en)] | order(_createdAt desc) [0...20]{
  "en": title.en,
  "ar": title.ar
}`;
