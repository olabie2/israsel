import type { NextConfig } from "next";
// Use the ES Module 'import' statement

import createNextIntlPlugin from 'next-intl/plugin';
// Then, destructure the i18n property from the imported object

const nextConfig: NextConfig = {  
  /* config options here */
  reactStrictMode: true,
};
 
const withNextIntl = createNextIntlPlugin('./app/i18n/request.ts');
export default withNextIntl(nextConfig);