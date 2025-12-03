"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

interface BookingData {
  id: string;
  room: {
    name: string;
  };
  startTime: string;
  endTime: string;
  hours: number;
  paymentStatus: string;
}

export default function ThankYouPage() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const [booking, setBooking] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (bookingId) {
      fetchBooking();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      const response = await fetch(`/api/bookings`);
      const data = await response.json();
      const foundBooking = data.bookings?.find(
        (b: any) => b.id === bookingId
      );
      setBooking(foundBooking || null);
    } catch (error) {
      console.error("Error fetching booking:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">טוען...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            תודה על ההזמנה!
          </h1>
          <p className="text-gray-600">
            ההזמנה שלך התקבלה בהצלחה
          </p>
        </div>

        {booking && (
          <div className="bg-gray-50 rounded-lg p-6 mb-6 text-right">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              פרטי ההזמנה
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">חדר:</span>
                <span className="font-semibold">{booking.room.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">תאריך:</span>
                <span className="font-semibold">
                  {new Date(booking.startTime).toLocaleDateString("he-IL")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">שעות:</span>
                <span className="font-semibold">{booking.hours}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">סטטוס תשלום:</span>
                <span
                  className={`font-semibold ${
                    booking.paymentStatus === "COMPLETED"
                      ? "text-green-600"
                      : "text-yellow-600"
                  }`}
                >
                  {booking.paymentStatus === "COMPLETED"
                    ? "שולם"
                    : "ממתין לתשלום"}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-4">
          <Link
            href="/"
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            חזרה לעמוד הבית
          </Link>
        </div>
      </div>
    </main>
  );
}

