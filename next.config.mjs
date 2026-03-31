import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');
 
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
  // Ensure Chromium and Puppeteer packages are not bundled by webpack
  serverExternalPackages: ['@sparticuz/chromium-min', 'puppeteer-core'],
  // Include fonts directory in Vercel serverless function bundle
  // Required for @sparticuz/chromium font rendering (Arabic, CJK, etc.)
  outputFileTracingIncludes: {
    '/api/product-brochure': ['./fonts/**/*'],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Ensure Chromium binaries are included in server bundle
      config.module.rules.push({
        test: /\.br$/,
        type: 'asset/resource',
      });
    }
    return config;
  },
};
 
export default withNextIntl(nextConfig);
