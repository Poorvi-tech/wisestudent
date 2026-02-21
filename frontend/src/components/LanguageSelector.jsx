import React, { useEffect, useMemo, useRef, useState } from "react";
import { Globe, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LANGUAGE_STORAGE_KEY } from "../i18n";

const defaultLanguages = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
];

const LanguageSelector = ({ languages = defaultLanguages, value, onChange }) => {
  const containerRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const { i18n } = useTranslation();
  const current = value || i18n.language || languages[0]?.code;

  useEffect(() => {
    if (value && value !== i18n.language) {
      i18n.changeLanguage(value);
    }
  }, [value, i18n]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentLabel = useMemo(() => {
    return languages.find((lang) => lang.code === current)?.label || "Language";
  }, [current, languages]);

  const handleSelect = (code) => {
    i18n.changeLanguage(code);
    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, code);
    } catch {
      // Ignore storage errors
    }
    setIsOpen(false);
    if (onChange) onChange(code);
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        className="flex items-center gap-2 h-[44px] px-3 sm:px-4 py-2.5 rounded-lg font-bold text-sm text-white shadow-md border-2 border-teal-400 bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-500 hover:shadow-lg transition-all duration-200 cursor-pointer"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
            <Globe className="w-4 h-4" />
          </span>
          <span className="hidden sm:inline">{currentLabel}</span>
          <span className="sm:hidden">Lang</span>
        </span>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-44 rounded-xl border-2 border-teal-200 bg-white shadow-xl p-2 z-20"
          role="listbox"
        >
          {languages.map((lang) => {
            const isActive = lang.code === current;
            return (
              <button
                key={lang.code}
                type="button"
                className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-r from-teal-400 to-blue-500 text-white shadow"
                    : "text-gray-700 hover:bg-teal-50"
                }`}
                onClick={() => handleSelect(lang.code)}
                role="option"
                aria-selected={isActive}
              >
                <span>{lang.label}</span>
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    isActive ? "bg-white" : "bg-teal-400"
                  }`}
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
