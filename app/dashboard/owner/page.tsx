"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Users, 
  CreditCard, 
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowLeft,
  Download,
  Plus,
  Image as ImageIcon,
  Building2
} from "lucide-react";

interface DashboardStats {
  revenue: { value: number; change: number };
  bookings: { value: number };
  occupancy: { value: number };
  newMembers: { value: number };
}

interface RecentBooking {
  id: string;
  user: string;
  room: string;
  date: string;
  status: 'approved' | 'pending' | 'cancelled';
  amount: string;
}

export default function OwnerDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
  const [userName, setUserName] = useState("Owner");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/dashboard/owner/stats');
        const data = await response.json();
        if (response.ok) {
          setStats(data.stats);
          setRecentBookings(data.recentBookings);
          setUserName(data.userName);
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const KPI_CARDS = [
    { 
      label: "הכנסות החודש", 
      value: stats ? `₪${stats.revenue.value.toLocaleString()}` : "₪0", 
      change: stats?.revenue.change, 
      icon: CreditCard,
      color: "text-emerald-600",
      bg: "bg-emerald-50"
    },
    { 
      label: "הזמנות היום", 
      value: stats?.bookings.value.toString() || "0", 
      change: null, 
      icon: Calendar,
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    { 
      label: "תפוסה משוערת", 
      value: stats ? `${stats.occupancy.value}%` : "0%", 
      change: null, 
      icon: Clock,
      color: "text-violet-600",
      bg: "bg-violet-50"
    },
    { 
      label: "חברים חדשים", 
      value: stats?.newMembers.value.toString() || "0", 
      change: null, 
      icon: Users,
      color: "text-amber-600",
      bg: "bg-amber-50"
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            סקירה כללית
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            ברוך הבא, {userName}. הנה מה שקורה במתחם שלך היום.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm">
            <Download className="w-4 h-4" />
            ייצא דוח
          </button>
          <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200">
            <Plus className="w-4 h-4" />
            הזמנה חדשה
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {KPI_CARDS.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              {stat.change !== null && (
                <span className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                  stat.change >= 0 ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                }`}>
                  {stat.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {Math.abs(stat.change)}%
                </span>
              )}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-1 h-6 bg-indigo-600 rounded-full"></div>
              <h2 className="text-lg font-bold text-gray-900">הזמנות אחרונות</h2>
            </div>
            <Link href="/dashboard/owner/bookings" className="text-sm text-indigo-600 font-medium hover:text-indigo-700 flex items-center gap-1 hover:gap-2 transition-all">
              לכל ההזמנות <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>
          
          {recentBookings.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-gray-300" />
              </div>
              <h3 className="text-gray-900 font-medium mb-1">אין הזמנות אחרונות</h3>
              <p className="text-gray-500 text-sm">הזמנות חדשות יופיעו כאן ברגע שייכנסו למערכת.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead className="bg-gray-50/50 text-xs text-gray-500 uppercase font-medium border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 w-1/3">משתמש</th>
                    <th className="px-6 py-4">חדר</th>
                    <th className="px-6 py-4">תאריך</th>
                    <th className="px-6 py-4">סטטוס</th>
                    <th className="px-6 py-4 text-left">סכום</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-sm">
                  {recentBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50/80 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs border border-indigo-100">
                            {booking.user.charAt(0)}
                          </div>
                          <span className="font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">
                            {booking.user}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{booking.room}</td>
                      <td className="px-6 py-4 text-gray-500 font-mono text-xs">{booking.date}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                          booking.status === "approved" 
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                            : booking.status === "pending"
                            ? "bg-amber-50 text-amber-700 border-amber-100"
                            : "bg-rose-50 text-rose-700 border-rose-100"
                        }`}>
                          {booking.status === "approved" && <CheckCircle2 className="w-3 h-3" />}
                          {booking.status === "pending" && <Clock className="w-3 h-3" />}
                          {booking.status === "cancelled" && <XCircle className="w-3 h-3" />}
                          {booking.status === "approved" ? "אושר" : booking.status === "pending" ? "ממתין" : "בוטל"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-left font-medium text-gray-900">{booking.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Column Widgets */}
        <div className="space-y-6">
          {/* Occupancy Widget */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-indigo-600" />
                </div>
                <span className="text-xs font-medium bg-green-50 text-green-600 px-2.5 py-1 rounded-full border border-green-100">
                  בזמן אמת
                </span>
              </div>
              
              <h3 className="text-sm font-medium text-gray-500 mb-2">תפוסה נוכחית</h3>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-4xl font-bold tracking-tight text-gray-900">{stats?.occupancy.value || 0}%</span>
                <span className="text-sm text-gray-400">מהחדרים תפוסים</span>
              </div>
              
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-full rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: `${stats?.occupancy.value || 0}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Quick Actions Widget */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">קיצורי דרך</h3>
            <div className="space-y-2">
              <Link href="/dashboard/owner/rooms" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all group">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <Building2 className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">ניהול חדרים</div>
                  <div className="text-xs text-gray-500">ערוך זמינות ומחירים</div>
                </div>
                <ArrowLeft className="w-4 h-4 text-gray-300 group-hover:text-indigo-600 transition-colors" />
              </Link>
              
              <Link href="/dashboard/owner/members" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all group">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
                  <Users className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">הוספת חבר</div>
                  <div className="text-xs text-gray-500">צור מנוי חדש</div>
                </div>
                <ArrowLeft className="w-4 h-4 text-gray-300 group-hover:text-indigo-600 transition-colors" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
