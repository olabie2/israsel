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
              {/* {t("mainMessage")} */}
            </p>
          </div>



          {/* Footer text */}
          <div className="border-t border-gray-700 pt-6">
            <p className="text-gray-400 text-sm">
              {t("madeWith")} <a className="underline text-white font-bold" href="https://github.com/olabie2">@olabie</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}