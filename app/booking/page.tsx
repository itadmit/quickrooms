"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

interface Room {
  id: string;
  name: string;
  capacity: number;
  images: string; // Changed from string[] to string
  creditsPerHour: number;
  pricePerHour: number;
  space: {
    name: string;
    address: string;
  };
}

export default function BookingPage() {
  const searchParams = useSearchParams();
  const roomId = searchParams.get("roomId");
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState<"member" | "guest">("member");
  const [formData, setFormData] = useState({
    startTime: "",
    endTime: "",
    guestName: "",
    guestEmail: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (roomId) {
      fetchRoom();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  const fetchRoom = async () => {
    if (!roomId) {
      setLoading(false);
      return;
    }
    
    try {
      const response = await fetch(`/api/rooms/${roomId}`);
      const data = await response.json();
      if (response.ok) {
        setRoom(data.room);
      }
    } catch (error) {
      console.error("Error fetching room:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateHours = () => {
    if (!formData.startTime || !formData.endTime) return 0;
    const start = new Date(formData.startTime);
    const end = new Date(formData.endTime);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60));
  };

  const calculateCost = () => {
    const hours = calculateHours();
    if (!room || hours <= 0) return { credits: 0, price: 0 };
    
    if (userType === "member") {
      return {
        credits: hours * room.creditsPerHour,
        price: 0,
      };
    } else {
      return {
        credits: 0,
        price: hours * room.pricePerHour,
      };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const hours = calculateHours();
      if (hours <= 0) {
        alert("זמן סיום חייב להיות אחרי זמן התחלה");
        return;
      }

      const bookingData: any = {
        roomId,
        startTime: formData.startTime,
        endTime: formData.endTime,
      };

      if (userType === "member") {
        // Get member ID from auth
        const meResponse = await fetch("/api/auth/me");
        if (meResponse.ok) {
          const meData = await meResponse.json();
          bookingData.memberId = meData.user.id;
        } else {
          alert("נדרשת התחברות כ-Member");
          return;
        }
      } else {
        if (!formData.guestName || !formData.guestEmail) {
          alert("נדרשים שם ואימייל לאורח");
          return;
        }
        bookingData.guestEmail = formData.guestEmail;
        bookingData.guestName = formData.guestName;
      }

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to thank you page
        const bookingId = data.booking?.id;
        if (bookingId) {
          window.location.href = `/booking/thank-you?bookingId=${bookingId}`;
        } else {
          alert("ההזמנה בוצעה בהצלחה!");
        }
      } else {
        alert(data.error || "שגיאה בביצוע ההזמנה");
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      alert("שגיאה בביצוע ההזמנה");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">טוען...</div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">חדר לא נמצא</p>
          <Link href="/" className="text-indigo-600 hover:text-indigo-700">
            חזרה לעמוד הבית
          </Link>
        </div>
      </div>
    );
  }

  const { credits, price } = calculateCost();
  const hours = calculateHours();

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="text-indigo-600 hover:text-indigo-700">
            ← חזרה לעמוד הבית
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{room.name}</h1>
            <p className="text-gray-600 mb-4">
              {room.space.name} - {room.space.address}
            </p>
            <p className="text-sm text-gray-500">קיבולת: {room.capacity} אנשים</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">הזמנת חדר</h2>

            <div className="mb-6">
              <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => setUserType("member")}
                  className={`flex-1 py-2 px-4 rounded-md font-semibold transition-colors ${
                    userType === "member"
                      ? "bg-indigo-600 text-white"
                      : "text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Member (קרדיטים)
                </button>
                <button
                  type="button"
                  onClick={() => setUserType("guest")}
                  className={`flex-1 py-2 px-4 rounded-md font-semibold transition-colors ${
                    userType === "guest"
                      ? "bg-indigo-600 text-white"
                      : "text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  אורח (תשלום)
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    זמן התחלה
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    זמן סיום
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              {userType === "guest" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      שם מלא
                    </label>
                    <input
                      type="text"
                      value={formData.guestName}
                      onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      אימייל
                    </label>
                    <input
                      type="email"
                      value={formData.guestEmail}
                      onChange={(e) => setFormData({ ...formData, guestEmail: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </>
              )}

              {hours > 0 && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700">מספר שעות:</span>
                    <span className="font-semibold">{hours}</span>
                  </div>
                  {userType === "member" ? (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">קרדיטים נדרשים:</span>
                      <span className="font-semibold text-indigo-600">{credits}</span>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">מחיר כולל:</span>
                      <span className="font-semibold text-indigo-600">${price.toFixed(2)}</span>
                    </div>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                {submitting ? "מבצע הזמנה..." : "אשר הזמנה"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

