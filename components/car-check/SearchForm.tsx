"use client";

import { FormEvent, KeyboardEvent } from "react";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";
import { FaSearch } from "react-icons/fa";

type SearchFormProps = {
    carNumberInput: string;
    setCarNumberInput: (value: string) => void;
    onSubmit: (e: FormEvent) => void;
    onKeyPress: (e: KeyboardEvent<HTMLInputElement>) => void;
    isSearching: boolean;
};

export const SearchForm = ({
    carNumberInput,
    setCarNumberInput,
    onSubmit,
    onKeyPress,
    isSearching,
}: SearchFormProps) => {
    const tCar = useTranslations("CarCheck");

    return (
        <div className="bg-white py-12">
            <div className="mx-auto max-w-2xl px-4">
                <form onSubmit={onSubmit} className="space-y-6">
                    <div>
                        <label
                            htmlFor="carNumber"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            {tCar("vehicleNumberLabel")}
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                id="carNumber"
                                value={carNumberInput}
                                onChange={(e) => setCarNumberInput(e.target.value)}
                                onKeyDown={onKeyPress}
                                placeholder={tCar("vehicleNumberPlaceholder")}
                                maxLength={8}
                                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-lg focus:border-transparent focus:ring-2 focus:ring-blue-500"
                                aria-label="Vehicle Number Input"
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={isSearching}
                        className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {isSearching ? (
                            <>
                                <div className="flex items-center">
                                    <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                                    {tCar("searching")}
                                </div>
                            </>
                        ) : (
                            <>
                                <FaSearch className="me-2" /> {tCar("searchVehicleButton")}
                            </>
                        )}
                    </button>
                </form>
                <p className="mt-4 text-center text-sm font-medium text-blue-600">
                    {tCar("searchHint")}
                </p>
            </div>
        </div>
    );
};
