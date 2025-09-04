// Footer.tsx
import { getTranslations } from "next-intl/server";

export default async function Footer() {
  const t = await getTranslations("Footer");

  return (
    <footer className="bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          {/* Main message */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              {t("loveWhatYouSee")}
            </h3>
            <p className="text-gray-300 max-w-2xl mx-auto text-lg leading-relaxed">
              {t("mainMessage")}
            </p>
          </div>

          {/* Coffee button */}
          <div className="mb-8">
            <a
              href="https://buymeacoffee.com/olabie"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <span className="text-2xl">☕</span>
              <span className="text-lg">{t("buyMeACoffee")}</span>
            </a>
          </div>

          {/* Decorative elements */}
          <div className="flex justify-center items-center space-x-4 text-2xl mb-6">
            <span className="animate-bounce">🚀</span>
            <span className="animate-pulse">💫</span>
            <span className="animate-bounce">🎨</span>
          </div>

          {/* Footer text */}
          <div className="border-t border-gray-700 pt-6">
            <p className="text-gray-400 text-sm">
              {t("madeWith")}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}