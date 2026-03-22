import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);
 
export const config = {
  // Match only internationalized pathnames
  matcher: [
    '/',
    '/(ar|en)((?!/studio|/api|_next|_vercel|.*\\..*).*)',
    '/((?!_next|_vercel|api|studio|.*\\..*).*)'
  ]
};
