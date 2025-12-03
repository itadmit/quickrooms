"use client";

import { useEffect, useState } from "react";
import { BarChart3, TrendingUp, Calendar, DollarSign, Users, Clock, Download } from "lucide-react";

export default function ReportsPage() {
  const [loading, setLoading] = useState(false);

  // Mock data - בעתיד יגיע מה-API
  const stats = {
    totalRevenue: 12450,
    totalBookings: 87,
    totalMembers: 24,
    avgOccupancy: 68
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            דוחות ונתונים
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            ניתוח מעמיק של פעילות המתחם והכנסות
          </p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200">
          <Download className="w-4 h-4" />
          ייצא דוח מלא
        </button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">סה"כ הכנסות</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">₪{stats.totalRevenue.toLocaleString()}</p>
          <div className="flex items-center gap-1 text-xs text-green-600">
            <TrendingUp className="w-3 h-3" />
            <span>+12% מהחודש שעבר</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">סה"כ הזמנות</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{stats.totalBookings}</p>
          <div className="flex items-center gap-1 text-xs text-green-600">
            <TrendingUp className="w-3 h-3" />
            <span>+8% מהחודש שעבר</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">חברים פעילים</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{stats.totalMembers}</p>
          <div className="flex items-center gap-1 text-xs text-green-600">
            <TrendingUp className="w-3 h-3" />
            <span>+4 חברים חדשים</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">תפוסה ממוצעת</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{stats.avgOccupancy}%</p>
          <div className="text-xs text-gray-500">שעות תפוסה ביום</div>
        </div>
      </div>

      {/* Charts Placeholders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-1 h-6 bg-emerald-500 rounded-full"></div>
              <h2 className="text-lg font-bold text-gray-900">הכנסות לפי חודש</h2>
            </div>
          </div>
          <div className="p-12 flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
            <div className="text-center">
              <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-sm">גרף הכנסות יוצג כאן</p>
              <p className="text-gray-400 text-xs mt-1">נתונים אמיתיים יופיעו בקרוב</p>
            </div>
          </div>
        </div>

        {/* Bookings Chart */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
              <h2 className="text-lg font-bold text-gray-900">הזמנות לפי יום</h2>
            </div>
          </div>
          <div className="p-12 flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
            <div className="text-center">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-sm">גרף הזמנות יוצג כאן</p>
              <p className="text-gray-400 text-xs mt-1">נתונים אמיתיים יופיעו בקרוב</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Rooms */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-purple-500 rounded-full"></div>
            <h2 className="text-lg font-bold text-gray-900">חדרים פופולריים</h2>
          </div>
        </div>
        <div className="p-12 text-center bg-gradient-to-br from-gray-50 to-white">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-8 h-8 text-gray-300" />
          </div>
          <p className="text-gray-500 text-sm">נתוני חדרים פופולריים יופיעו כאן</p>
          <p className="text-gray-400 text-xs mt-1">מבוסס על כמות הזמנות והכנסות</p>
        </div>
      </div>
    </div>
  );
}
