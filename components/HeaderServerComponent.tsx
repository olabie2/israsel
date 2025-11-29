import { getTranslations } from "next-intl/server";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import Link from "next/link";
import MobileNav from "./MobileNav";

type Props = { locale: string };

export default async function HeaderServerComponent({ locale }: Props) {
  const t = await getTranslations("Header");

  return (
    <header className="shadow-md bg-black text-white relative">
      <div className="header-container flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <div className="logo font-bold text-xl">
          <Link href="/">Israsel</Link>
        </div>

        {/* Desktop Nav - Hidden on mobile */}
        <nav className="hidden md:flex space-x-6">
          <Link href="/" className="hover:text-blue-600">
            {t("home")}
          </Link>

          <Link href="/contact" className="hover:text-blue-600">
            {t("contact")}
          </Link>
        </nav>

        {/* Right side content: Language Switcher and Mobile Nav Button */}
        <div className="flex items-center space-x-4">
          {/* Language Switcher - kept separate */}
          <LanguageSwitcher />

          {/* MobileNav Component - Renders the button and handles its own logic */}
          <MobileNav homeText={t("home")} donateText={t("donate")} contactText={t("contact")} />
        </div>
      </div>
    </header>
  );
}