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
  "imageUrl": media.thumbnail.asset->url,
  warrantyMonths
}`;

export const allProductsPagedQuery = `*[_type == "product"] | order(_createdAt desc) [$start...$end]{
  _id,
  title,
  description,
  slug,
  category->{
    title,
    slug
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
  "imageUrl": media.thumbnail.asset->url,
  warrantyMonths
}`;

export const productsByCategoryPagedQuery = `*[_type == "product" && category->slug.current == $slug] | order(_createdAt desc) [$start...$end]{
  _id,
  title,
  description,
  slug,
  category->{
    title,
    slug
  },
  "imageUrl": media.thumbnail.asset->url,
  warrantyMonths
}`;

export const productsByCategoryCountQuery = `count(*[_type == "product" && category->slug.current == $slug])`;
