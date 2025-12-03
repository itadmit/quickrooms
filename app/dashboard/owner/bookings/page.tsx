"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { he } from "date-fns/locale";
import { Calendar, Clock, User, CreditCard, DollarSign, CheckCircle2, XCircle, Filter } from "lucide-react";

interface Booking {
  id: string;
  startTime: string;
  endTime: string;
  hours: number;
  creditsUsed: number | null;
  priceCharged: number | null;
  paymentStatus: string;
  room: {
    name: string;
    capacity: number;
  };
  member: {
    name: string;
    email: string;
  } | null;
  guestEmail: string | null;
  guestName: string | null;
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch(`/api/bookings`);
      const data = await response.json();
      setBookings(data.bookings || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (statusFilter === "all") return true;
    return booking.paymentStatus.toLowerCase() === statusFilter.toLowerCase();
  });

  if (loading) {
    return (
      <div className="h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            יומן הזמנות
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            צפה ונהל את כל ההזמנות במתחם
          </p>
        </div>
        
        {/* Status Filter */}
        <div className="flex items-center gap-3">
          <Filter className="w-4 h-4 text-gray-400" />
          <div className="flex gap-2 bg-gray-50 p-1 rounded-xl border border-gray-200">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                statusFilter === "all"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              הכל
            </button>
            <button
              onClick={() => setStatusFilter("completed")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                statusFilter === "completed"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              הושלמו
            </button>
            <button
              onClick={() => setStatusFilter("pending")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                statusFilter === "pending"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              ממתינים
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">סה"כ הזמנות</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{bookings.length}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">הושלמו</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {bookings.filter(b => b.paymentStatus === "COMPLETED").length}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">ממתינים</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {bookings.filter(b => b.paymentStatus === "PENDING").length}
          </p>
        </div>
      </div>

      {/* Bookings Table */}
      {filteredBookings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="text-gray-900 font-medium mb-1">אין הזמנות</h3>
          <p className="text-gray-500 text-sm">הזמנות חדשות יופיעו כאן</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="bg-gray-50/50 text-xs text-gray-500 uppercase font-medium border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">משתמש</th>
                  <th className="px-6 py-4">חדר</th>
                  <th className="px-6 py-4">תאריך ושעה</th>
                  <th className="px-6 py-4">משך</th>
                  <th className="px-6 py-4">תשלום</th>
                  <th className="px-6 py-4">סטטוס</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs border border-indigo-100">
                          {booking.member ? booking.member.name.charAt(0) : booking.guestName?.charAt(0) || "G"}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {booking.member?.name || booking.guestName || "אורח"}
                          </div>
                          <div className="text-xs text-gray-500">
                            {booking.member?.email || booking.guestEmail}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-900 font-medium">{booking.room.name}</div>
                      <div className="text-xs text-gray-500">עד {booking.room.capacity} איש</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-900">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {format(new Date(booking.startTime), "dd/MM/yyyy HH:mm", { locale: he })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium border border-purple-100">
                        <Clock className="w-3 h-3" />
                        {booking.hours} שעות
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {booking.creditsUsed ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium border border-blue-100">
                          <CreditCard className="w-3 h-3" />
                          {booking.creditsUsed} קרדיטים
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium border border-emerald-100">
                          <DollarSign className="w-3 h-3" />
                          ₪{booking.priceCharged}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                        booking.paymentStatus === "COMPLETED"
                          ? "bg-green-50 text-green-700 border-green-100"
                          : booking.paymentStatus === "PENDING"
                          ? "bg-amber-50 text-amber-700 border-amber-100"
                          : "bg-red-50 text-red-700 border-red-100"
                      }`}>
                        {booking.paymentStatus === "COMPLETED" && <CheckCircle2 className="w-3 h-3" />}
                        {booking.paymentStatus === "PENDING" && <Clock className="w-3 h-3" />}
                        {booking.paymentStatus === "FAILED" && <XCircle className="w-3 h-3" />}
                        {booking.paymentStatus === "COMPLETED" ? "הושלם" : booking.paymentStatus === "PENDING" ? "ממתין" : "נכשל"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
