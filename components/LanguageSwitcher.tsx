"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LuLanguages, LuChevronDown } from "react-icons/lu";
import { useLocale } from "next-intl";
import { useState, useEffect, useRef } from "react";

// Added a "short" property for the 2-letter code
const languages = [
  { code: "en", label: "English", short: "EN" },
  { code: "he", label: "עברית", short: "HE" },
  { code: "ar", label: "العربية", short: "AR" },
  { code: "ru", label: "Русский", short: "RU" },
];

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentLanguage = languages.find((l) => l.code === locale);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);


  return (
    <div className="relative" ref={dropdownRef}>
      {/* --- RESPONSIVE BUTTON --- */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between rounded-lg bg-white text-gray-800 border border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 shadow-sm
                   px-3 py-2 w-full  /* --- Mobile styles: smaller padding --- */
                   md:px-4 md:py-3 md:min-w-[140px] /* --- Desktop overrides: larger padding and width --- */"
      >
        <div className="flex items-center space-x-2">
          {/* Icon: Hidden on mobile, shown on desktop */}
          <LuLanguages className="text-lg text-gray-600 hidden md:block" />

          {/* Full Label: Hidden on mobile, shown on desktop */}
          <span className="font-medium text-sm hidden md:block">
            {currentLanguage?.label || "Select"}
          </span>

          {/* Short Code: Shown on mobile, hidden on desktop */}
          <span className="font-medium text-sm md:hidden">
            {currentLanguage?.short || "Lang"}
          </span>
        </div>
        <LuChevronDown
          className={`text-sm text-gray-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* --- RESPONSIVE DROPDOWN --- */}
      <div
        className={`absolute right-0 top-full pt-1 transition-all duration-200 ease-out z-50
                   w-32 /* --- Mobile width --- */
                   md:w-44 /* --- Desktop width --- */
                   ${
                     isOpen
                       ? "opacity-100 visible translate-y-0"
                       : "opacity-0 invisible translate-y-1"
                   }`}
      >
        <div className="bg-white border border-gray-200 rounded-xl shadow-lg">
          <div className="py-2">
            {languages.map((lang, idx) => (
              <div key={lang.code}>
                <Link
                  href={`/${lang.code}${pathname.replace(/^\/[a-z]{2}/, "")}`}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center px-4 py-2 text-sm hover:bg-blue-50 hover:text-blue-700 transition-colors duration-150 ${
                    locale === lang.code
                      ? "bg-blue-50 text-blue-700 font-medium"
                      : "text-gray-700"
                  }`}
                >
                  {/* Show short code on mobile */}
                  <span className="flex-1 md:hidden">{lang.short}</span>
                  {/* Show full label on desktop */}
                  <span className="flex-1 hidden md:inline">{lang.label}</span>

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