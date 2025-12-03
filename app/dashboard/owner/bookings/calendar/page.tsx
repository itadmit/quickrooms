"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks, eachDayOfInterval, isSameDay, isSameMonth } from "date-fns";
import { he } from "date-fns/locale";

interface Booking {
  id: string;
  startTime: string;
  endTime: string;
  hours: number;
  room: {
    name: string;
  };
  member: {
    name: string;
  } | null;
  guestName: string | null;
}

export default function CalendarPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"week" | "month">("week");
  const [selectedRoom, setSelectedRoom] = useState<string>("");
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
    fetchRooms();
  }, [currentDate, selectedRoom]);

  const fetchBookings = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedRoom) params.append("roomId", selectedRoom);

      const response = await fetch(`/api/bookings?${params.toString()}`);
      const data = await response.json();
      setBookings(data.bookings || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRooms = async () => {
    try {
      // Fetch all spaces and their rooms
      const response = await fetch("/api/spaces");
      const data = await response.json();
      const allRooms: any[] = [];
      data.spaces?.forEach((space: any) => {
        space.meetingRooms?.forEach((room: any) => {
          allRooms.push({ ...room, spaceName: space.name });
        });
      });
      setRooms(allRooms);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  const getBookingsForDate = (date: Date) => {
    return bookings.filter((booking) => {
      const start = new Date(booking.startTime);
      const end = new Date(booking.endTime);
      return (
        isSameDay(start, date) ||
        isSameDay(end, date) ||
        (start <= date && end >= date)
      );
    });
  };

  const renderWeekView = () => {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
    const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 });
    const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="grid grid-cols-7 border-b">
          {weekDays.map((day) => (
            <div
              key={day.toISOString()}
              className="p-4 text-center font-semibold text-gray-700 border-l"
            >
              {format(day, "EEEE", { locale: he })}
              <br />
              <span className="text-sm text-gray-500">
                {format(day, "d/M", { locale: he })}
              </span>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 min-h-[400px]">
          {weekDays.map((day) => {
            const dayBookings = getBookingsForDate(day);
            return (
              <div
                key={day.toISOString()}
                className="border-l border-t p-2 min-h-[400px]"
              >
                <div className="space-y-2">
                  {dayBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="bg-indigo-100 text-indigo-800 text-xs p-2 rounded cursor-pointer hover:bg-indigo-200"
                      title={`${booking.room.name} - ${format(
                        new Date(booking.startTime),
                        "HH:mm"
                      )}-${format(new Date(booking.endTime), "HH:mm")}`}
                    >
                      <div className="font-semibold">{booking.room.name}</div>
                      <div className="text-xs">
                        {format(new Date(booking.startTime), "HH:mm")} -{" "}
                        {format(new Date(booking.endTime), "HH:mm")}
                      </div>
                      <div className="text-xs">
                        {booking.member?.name || booking.guestName || "אורח"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderMonthView = () => {
    const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const monthStartWeek = startOfWeek(monthStart, { weekStartsOn: 0 });
    const monthEndWeek = endOfWeek(monthEnd, { weekStartsOn: 0 });
    const monthDays = eachDayOfInterval({ start: monthStartWeek, end: monthEndWeek });

    const weeks: Date[][] = [];
    for (let i = 0; i < monthDays.length; i += 7) {
      weeks.push(monthDays.slice(i, i + 7));
    }

    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="grid grid-cols-7 border-b">
          {["א", "ב", "ג", "ד", "ה", "ו", "ש"].map((day) => (
            <div
              key={day}
              className="p-4 text-center font-semibold text-gray-700 border-l"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="divide-y">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-7 min-h-[120px]">
              {week.map((day) => {
                const dayBookings = getBookingsForDate(day);
                const isCurrentMonth = isSameMonth(day, currentDate);
                return (
                  <div
                    key={day.toISOString()}
                    className={`border-l p-2 ${
                      !isCurrentMonth ? "bg-gray-50" : ""
                    }`}
                  >
                    <div
                      className={`text-sm mb-1 ${
                        isCurrentMonth ? "text-gray-900" : "text-gray-400"
                      }`}
                    >
                      {format(day, "d")}
                    </div>
                    <div className="space-y-1">
                      {dayBookings.slice(0, 3).map((booking) => (
                        <div
                          key={booking.id}
                          className="bg-indigo-100 text-indigo-800 text-xs p-1 rounded truncate"
                          title={`${booking.room.name} - ${format(
                            new Date(booking.startTime),
                            "HH:mm"
                          )}`}
                        >
                          {booking.room.name}
                        </div>
                      ))}
                      {dayBookings.length > 3 && (
                        <div className="text-xs text-gray-500">
                          +{dayBookings.length - 3} עוד
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">טוען...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-4 items-center">
              <Link
                href="/dashboard/owner/bookings"
                className="text-indigo-600 hover:text-indigo-700"
              >
                ← חזרה לרשימה
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">לוח זמנים</h1>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-4 items-center">
              <button
                onClick={() =>
                  setCurrentDate(
                    viewMode === "week"
                      ? subWeeks(currentDate, 1)
                      : new Date(
                          currentDate.getFullYear(),
                          currentDate.getMonth() - 1,
                          1
                        )
                  )
                }
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                ← קודם
              </button>
              <h2 className="text-xl font-semibold">
                {viewMode === "week"
                  ? `שבוע ${format(startOfWeek(currentDate), "d/M", {
                      locale: he,
                    })} - ${format(endOfWeek(currentDate), "d/M", {
                      locale: he,
                    })}`
                  : format(currentDate, "MMMM yyyy", { locale: he })}
              </h2>
              <button
                onClick={() =>
                  setCurrentDate(
                    viewMode === "week"
                      ? addWeeks(currentDate, 1)
                      : new Date(
                          currentDate.getFullYear(),
                          currentDate.getMonth() + 1,
                          1
                        )
                  )
                }
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                הבא →
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                היום
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("week")}
                className={`px-4 py-2 rounded-lg ${
                  viewMode === "week"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                שבועי
              </button>
              <button
                onClick={() => setViewMode("month")}
                className={`px-4 py-2 rounded-lg ${
                  viewMode === "month"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                חודשי
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              פילטר לפי חדר
            </label>
            <select
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">כל החדרים</option>
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.name} ({room.spaceName})
                </option>
              ))}
            </select>
          </div>
        </div>

        {viewMode === "week" ? renderWeekView() : renderMonthView()}
      </div>
    </main>
  );
}

