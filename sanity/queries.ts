export const categoryQuery = `*[_type == "category"]{
  _id,
  title,
  description,
  icon,
  slug,
  "image": image.asset->url
}`;
