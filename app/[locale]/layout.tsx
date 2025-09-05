// import type { Metadata } from "next";
import "./globals.css";
import "../../public/style.css";
import { Poppins } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "../i18n/routing";
import HeaderServerComponent from "@/components/HeaderServerComponent";
import Footer from "@/components/Footer";
import { GoogleAnalytics } from '@next/third-parties/google';
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

export default async function RootLayout({ children, params }: LayoutProps) {
  const { locale } = await params; // Await the params Promise
  
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