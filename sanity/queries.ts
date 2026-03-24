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


