"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { he } from "date-fns/locale";
import { Plus, FileText, CheckCircle, XCircle, Clock } from "lucide-react";

interface Quote {
  id: string;
  room: { name: string };
  member: { name: string } | null;
  guestName: string | null;
  startTime: string;
  endTime: string;
  hours: number;
  creditsRequired: number | null;
  price: number | null;
  status: string;
  expiresAt: string;
}

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    try {
      const response = await fetch("/api/quotes");
      const data = await response.json();
      setQuotes(data.quotes || []);
    } catch (error) {
      console.error("Error fetching quotes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConvertToBooking = async (quoteId: string) => {
    try {
      const response = await fetch(`/api/quotes/${quoteId}/convert`, {
        method: "POST",
      });

      if (response.ok) {
        alert("הצעת המחיר הומרה להזמנה בהצלחה");
        fetchQuotes();
      } else {
        const data = await response.json();
        alert(data.error || "שגיאה בהמרה");
      }
    } catch (error) {
      console.error("Error converting quote:", error);
      alert("שגיאה בהמרה");
    }
  };

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">הצעות מחיר</h1>
          <p className="text-gray-500 text-sm mt-1">ניהול הצעות מחיר והמרה להזמנות</p>
        </div>
      </div>

      {quotes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-gray-900 font-medium mb-1">אין הצעות מחיר</h3>
          <p className="text-gray-500 text-sm">כרגע אין הצעות מחיר פעילות</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quotes.map((quote) => {
            const isExpired = new Date(quote.expiresAt) < new Date();
            return (
              <div
                key={quote.id}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {quote.room.name}
                    </h3>
                    <div className="text-sm text-gray-600">
                      {format(new Date(quote.startTime), "dd/MM/yyyy HH:mm", { locale: he })} -{" "}
                      {format(new Date(quote.endTime), "HH:mm", { locale: he })}
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      quote.status === "ACCEPTED"
                        ? "bg-green-50 text-green-700"
                        : quote.status === "REJECTED"
                        ? "bg-red-50 text-red-700"
                        : isExpired
                        ? "bg-gray-50 text-gray-700"
                        : "bg-yellow-50 text-yellow-700"
                    }`}
                  >
                    {quote.status === "ACCEPTED"
                      ? "אושר"
                      : quote.status === "REJECTED"
                      ? "נדחה"
                      : isExpired
                      ? "פג תוקף"
                      : "ממתין"}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">לקוח:</span>
                    <span className="font-medium text-gray-900">
                      {quote.member?.name || quote.guestName || "אורח"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">שעות:</span>
                    <span className="font-medium text-gray-900">{quote.hours}</span>
                  </div>
                  {quote.creditsRequired && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">קרדיטים:</span>
                      <span className="font-medium text-gray-900">
                        {quote.creditsRequired}
                      </span>
                    </div>
                  )}
                  {quote.price && quote.price > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">מחיר:</span>
                      <span className="font-medium text-green-600">
                        ₪{quote.price.toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">תפוגה:</span>
                    <span className="font-medium text-gray-900">
                      {format(new Date(quote.expiresAt), "dd/MM/yyyy", { locale: he })}
                    </span>
                  </div>
                </div>

                {quote.status === "PENDING" && !isExpired && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleConvertToBooking(quote.id)}
                      className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                    >
                      המר להזמנה
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

