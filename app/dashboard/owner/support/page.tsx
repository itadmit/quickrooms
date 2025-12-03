"use client";

import { useState } from "react";
import { HelpCircle, MessageSquare, FileText, Search } from "lucide-react";

const faqData = [
  {
    category: "הזמנות",
    questions: [
      {
        q: "איך מבטלים הזמנה?",
        a: "ניתן לבטל הזמנה עד 24 שעות לפני המועד. הקרדיטים יוחזרו אוטומטית לחשבון.",
      },
      {
        q: "איך משנים הזמנה?",
        a: "לחץ על כפתור העריכה בהזמנה ובחר תאריך ושעה חדשים.",
      },
      {
        q: "מה קורה אם אני מאחר?",
        a: "החדר שמור לך לפי השעות שנקבעו. אם תאחר, הזמן לא יוארך אוטומטית.",
      },
    ],
  },
  {
    category: "קרדיטים",
    questions: [
      {
        q: "איך מקבלים קרדיטים?",
        a: "קרדיטים מתחדשים אוטומטית כל חודש לפי החבילה שלך.",
      },
      {
        q: "מה קורה אם נגמרו הקרדיטים?",
        a: "אם יש לך הרשאה לחריגה, תוכל לשלם את ההפרש. אחרת, תצטרך להמתין לחידוש הקרדיטים.",
      },
      {
        q: "איך בודקים יתרת קרדיטים?",
        a: "היתרה מוצגת בדשבורד שלך ובכל הזמנה.",
      },
    ],
  },
  {
    category: "תשלומים",
    questions: [
      {
        q: "איך משלמים?",
        a: "תשלומים מתבצעים דרך PayMe בעת הזמנה אם אין מספיק קרדיטים.",
      },
      {
        q: "מתי מתקבל החזר?",
        a: "החזרים מתבצעים תוך 5-7 ימי עסקים.",
      },
      {
        q: "איך מורידים חשבונית?",
        a: "לחץ על כפתור ההורדה בהזמנה או בדף ההזמנות.",
      },
    ],
  },
];

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);

  const filteredFAQs = faqData
    .filter((category) => !selectedCategory || category.category === selectedCategory)
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (q) =>
          !searchQuery ||
          q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.a.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((category) => category.questions.length > 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">תמיכה טכנית</h1>
        <p className="text-gray-500 text-sm mt-1">שאלות נפוצות ותמיכה</p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="חפש שאלות..."
            className="w-full pr-10 pl-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mt-4">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === null
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            הכל
          </button>
          {faqData.map((category) => (
            <button
              key={category.category}
              onClick={() => setSelectedCategory(category.category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category.category
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category.category}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ List */}
      <div className="space-y-6">
        {filteredFAQs.map((category) => (
          <div key={category.category} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-indigo-600" />
              {category.category}
            </h2>
            <div className="space-y-3">
              {category.questions.map((item, idx) => {
                const questionId = `${category.category}-${idx}`;
                return (
                  <div key={idx} className="border-b border-gray-100 last:border-0 pb-3 last:pb-0">
                    <button
                      onClick={() =>
                        setOpenQuestion(openQuestion === questionId ? null : questionId)
                      }
                      className="w-full text-right flex items-center justify-between py-2 hover:text-indigo-600 transition-colors"
                    >
                      <span className="font-medium text-gray-900">{item.q}</span>
                      <MessageSquare
                        className={`w-4 h-4 text-gray-400 transition-transform ${
                          openQuestion === questionId ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {openQuestion === questionId && (
                      <div className="pr-6 pt-2 text-sm text-gray-600">{item.a}</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Contact Support */}
      <div className="bg-indigo-50 rounded-2xl border border-indigo-100 p-6">
        <h3 className="text-lg font-bold text-indigo-900 mb-2">צריך עזרה נוספת?</h3>
        <p className="text-sm text-indigo-700 mb-4">
          פנה לתמיכה הטכנית דרך האימייל או טלפון
        </p>
        <div className="flex gap-3">
          <a
            href="mailto:support@quickrooms.com"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
          >
            שלח אימייל
          </a>
          <a
            href="tel:+972501234567"
            className="px-4 py-2 border border-indigo-200 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors text-sm font-medium"
          >
            התקשר
          </a>
        </div>
      </div>
    </div>
  );
}

