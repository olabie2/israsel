// HeaderServerComponent.tsx
import { getTranslations } from "next-intl/server";

import LanguageSwitcher from "@/components/LanguageSwitcher";
import Link from "next/link";

type Props = { locale: string };

export default async function HeaderServerComponent({ locale }: Props) {
  const t = await getTranslations("Header");
  return (
    <header className="shadow-md bg-black">
      <div className="header-container flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <div className="logo font-bold text-xl">
          <Link href="/">Israsel</Link>
        </div>

        {/* Nav - NOW TRANSLATED */}
        <nav className="hidden md:flex space-x-6">
          <Link href="/" className="hover:text-blue-600">
            {t("home")}
          </Link>
          <Link href="https://buymeacoffee.com/olabie" className="hover:text-blue-600">
            {t("donate")}
          </Link>
        
        </nav>

        {/* Language Switcher and other header content */}
        <div className="relative group">
          <LanguageSwitcher />

          <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2 pointer-events-none group-hover:pointer-events-auto transition-all duration-200">
            <ul className="py-2 text-sm">
              <li>
                <Link href="/en" className="block px-4 py-2 hover:bg-gray-100">
                  English
                </Link>
              </li>
              <li>
                <Link href="/he" className="block px-4 py-2 hover:bg-gray-100">
                  עברית
                </Link>
              </li>
              <li>
                <Link href="/ar" className="block px-4 py-2 hover:bg-gray-100">
                  العربية
                </Link>
              </li>
              <li>
                <Link href="/ru" className="block px-4 py-2 hover:bg-gray-100">
                  Русский
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <button className="menu-toggle md:hidden" aria-label="Toggle Menu">
          ☰
        </button>
      </div>
    </header>
  );
}
