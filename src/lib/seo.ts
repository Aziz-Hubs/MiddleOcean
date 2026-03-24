export function getAlternateLanguages(path: string) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://middleocean.jo';
  // Ensure path starts with a slash if not empty and doesn't already have one
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  return {
    'en': `${baseUrl}/en${cleanPath === '/' ? '' : cleanPath}`,
    'ar': `${baseUrl}/ar${cleanPath === '/' ? '' : cleanPath}`,
  };
}
