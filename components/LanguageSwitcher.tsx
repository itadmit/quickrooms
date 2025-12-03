"use client";

import { useState, useEffect } from "react";
import { Globe } from "lucide-react";
import { setLanguage, getLanguage, type Language } from "@/lib/i18n";

export default function LanguageSwitcher() {
  const [currentLang, setCurrentLang] = useState<Language>('he');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setCurrentLang(getLanguage());
  }, []);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setCurrentLang(lang);
    setIsOpen(false);
    // Reload page to apply language changes
    window.location.reload();
  };

  const languages = [
    { code: 'he' as Language, name: 'עברית', flag: '🇮🇱' },
    { code: 'en' as Language, name: 'English', flag: '🇬🇧' },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <Globe className="w-5 h-5 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">
          {languages.find((l) => l.code === currentLang)?.flag}
        </span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="absolute left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full text-right px-4 py-2 hover:bg-gray-50 transition-colors flex items-center justify-between ${
                  currentLang === lang.code ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700'
                }`}
              >
                <span>{lang.name}</span>
                <span>{lang.flag}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

