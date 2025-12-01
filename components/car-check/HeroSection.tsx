"use client";

import { useTranslations } from "next-intl";

export const HeroSection = () => {
    const t = useTranslations("HomePage");

    return (
        <div className="relative flex min-h-[60vh] items-center justify-center overflow-hidden">
            <video
                className="absolute inset-0 h-full w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                poster="/186171-877288383-poster.webp"
            >
                <source src="/186171-877288383-small.webm" type="video/webm" />
                <source src="/186171-877288383_small.mp4" type="video/mp4" />
                <source src="/186171-877288383.mp4" type="video/mp4" />
                {t("videoTagNotSupported")}
            </video>

            <div className="relative z-10 mx-auto max-w-4xl px-4 text-center text-white">
                <div className="rounded-2xl bg-black/40 backdrop-blur-sm md:px-8 md:py-10 shadow-2xl">
                    <h1 className="mb-6 py-2 text-2xl md:text-4xl font-bold text-white md:text-6xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                        <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            {t("landing_title")}
                        </span>
                    </h1>
                    <p className="font-light text-[12px] text-white md:text-2xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                        {t("landing_description")}
                    </p>
                </div>
            </div>
        </div>
    );
};
