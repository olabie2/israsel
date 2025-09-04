"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LuLanguages, LuChevronDown } from 'react-icons/lu';
import { useLocale } from 'next-intl';

const languages = [
  { code: "en", label: "English" },
  { code: "he", label: "עברית" },
  { code: "ar", label: "العربية" },
  { code: "ru", label: "Русский" },
];

export default function LanguageSwitcher() {
  const locale = useLocale();
  console.log(locale);
  const pathname = usePathname();
  
  const currentLanguage = languages.find((l) => l.code === locale);

  return (
    <div className="relative group z-50">
      {/* Button with better padding and styling */}
      <button className="flex items-center justify-between min-w-[140px] px-4 py-3 rounded-lg bg-white text-gray-800 border border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 shadow-sm">
        <div className="flex items-center space-x-2">
          <LuLanguages className="text-lg text-gray-600" />
          <span className="font-medium text-sm">
            {currentLanguage?.label || "Select"}
          </span>
        </div>
        <LuChevronDown className="text-sm text-gray-500 group-hover:rotate-180 transition-transform duration-200" />
      </button>

      {/* Improved dropdown with better spacing and styling */}
      <div className="absolute right-0 top-full pt-1 w-44 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 translate-y-1 pointer-events-none group-hover:pointer-events-auto transition-all duration-200 ease-out">
        <div className="bg-white border border-gray-200 rounded-xl shadow-lg">
          <div className="py-2">
            {languages.map((lang, idx) => (
              <div key={lang.code}>
                <Link
                  href={`/${lang.code}${pathname.replace(/^\/[a-z]{2}/, "")}`}
                  className={`flex items-center px-4 py-3 text-sm hover:bg-blue-50 hover:text-blue-700 transition-colors duration-150 ${
                    locale === lang.code 
                      ? "bg-blue-50 text-blue-700 font-medium" 
                      : "text-gray-700"
                  }`}
                >
                  <span className="flex-1">{lang.label}</span>
                  {locale === lang.code && (
                    <div className="w-2 h-2 bg-blue-600 rounded-full ml-2"></div>
                  )}
                </Link>
                {idx < languages.length - 1 && (
                  <div className="mx-2 border-t border-gray-100"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}