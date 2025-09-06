import "./globals.css";
import "../../public/style.css";
import { Poppins } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "../i18n/routing";
import HeaderServerComponent from "@/components/HeaderServerComponent";
import Footer from "@/components/Footer";
import { GoogleAnalytics } from '@next/third-parties/google';
import type { Metadata } from 'next';

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

const rtlLangs = ["ar", "he"];


type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
};

type Locale = (typeof routing.locales)[number];


export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
 
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return {
    title: {
      template: `%s | ${t('siteName')}`,
      default: t('siteName'),
    },
    description: t('siteDescription'),
    keywords: t('keywords').split(', '),
    metadataBase: new URL('https://www.israsel.com'),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        'en': '/en',
        'he': '/he',
        'x-default': '/en',
      },
    },
    openGraph: {
      title: t('siteName'),
      description: t('siteDescription'),
      url: `https://www.israsel.com/${locale}`,
      siteName: t('siteName'),
      locale: locale,
      type: 'website',
    },
   
    twitter: {
      card: 'summary_large_image',
      title: t('siteName'),
      description: t('siteDescription'),
    },
  };
}

export default async function RootLayout({ children, params }: LayoutProps) {
 
  const { locale } = await params;
  
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }
  
  const messages = await getMessages();
  
  return (
    <html lang={locale} dir={rtlLangs.includes(locale) ? "rtl" : "ltr"}>
      <NextIntlClientProvider messages={messages}>
        <body className={`${poppins.className} antialiased`}>
          <HeaderServerComponent locale={locale} />
          {children}
          <Footer/>
        </body>
        <GoogleAnalytics gaId="G-QWNHFV141Q" />
      </NextIntlClientProvider>
    </html>
  );
}