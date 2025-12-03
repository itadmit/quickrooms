"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { he } from "date-fns/locale";
import { Clock, User, Mail, Calendar, Bell } from "lucide-react";

interface WaitlistEntry {
  id: string;
  preferredDate: string;
  preferredStartTime: string | null;
  preferredEndTime: string | null;
  notified: boolean;
  room: {
    id: string;
    name: string;
  };
  member: {
    id: string;
    name: string;
    email: string;
  } | null;
  guestEmail: string | null;
  guestName: string | null;
}

export default function WaitlistPage() {
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWaitlist();
  }, []);

  const fetchWaitlist = async () => {
    try {
      const response = await fetch("/api/waitlist");
      const data = await response.json();
      setEntries(data.entries || []);
    } catch (error) {
      console.error("Error fetching waitlist:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNotify = async (entryId: string) => {
    try {
      // TODO: Implement notification API
      alert("התראה נשלחה");
      fetchWaitlist();
    } catch (error) {
      console.error("Error notifying:", error);
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">רשימת המתנה</h1>
        <p className="text-gray-500 text-sm mt-1">ניהול רשימת המתנה לחדרים תפוסים</p>
      </div>

      {entries.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-gray-900 font-medium mb-1">אין רשימת המתנה</h3>
          <p className="text-gray-500 text-sm">כרגע אין אנשים ברשימת המתנה</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {entry.room.name}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    {format(new Date(entry.preferredDate), "dd/MM/yyyy", { locale: he })}
                  </div>
                </div>
                {entry.notified && (
                  <span className="px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
                    הוזהר
                  </span>
                )}
              </div>

              <div className="space-y-2 mb-4">
                {entry.preferredStartTime && entry.preferredEndTime && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    {entry.preferredStartTime} - {entry.preferredEndTime}
                  </div>
                )}
                {entry.member ? (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="w-4 h-4" />
                    {entry.member.name}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    {entry.guestEmail || entry.guestName}
                  </div>
                )}
              </div>

              {!entry.notified && (
                <button
                  onClick={() => handleNotify(entry.id)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Bell className="w-4 h-4" />
                  שלח התראה
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

