import sharp from "sharp"

// Display dimensions in PDF (pixels) - 2x for betterquality
export const PDF_DIMENSIONS = {
  logo: { width: 200, height: 200 },
  background: { width: 1200, height: 1700 },
  thumbnail: { width: 500, height: 500 },
  catalog: { width: 180, height: 180 },
}

// Sanity CDN optimization params (FREE on all plans)
export function optimizeSanityUrl(url: string, width: number): string {
  if (!url) return url
  if (!url.includes("cdn.sanity.io")) return url
  const separator = url.includes("?") ? "&" : "?"
  return `${url}${separator}w=${width}&q=85&auto=format&fm=jpg&bg=ffffff`
}

// Convert local PNG to optimized JPEG with white background
export async function optimizeLocalImage(
  localPath: string,
  targetWidth: number,
  targetHeight?: number
): Promise<string> {
  const buffer = await sharp(localPath)
    .flatten({ background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .resize(targetWidth, targetHeight, { fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 85, mozjpeg: true })
    .toBuffer()
  return `data:image/jpeg;base64,${buffer.toString("base64")}`
}