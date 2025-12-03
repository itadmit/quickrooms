"use client";

import { useEffect, useState } from "react";
import { format, subDays } from "date-fns";
import { BarChart3, TrendingUp, Clock, DollarSign } from "lucide-react";

export default function UsageReportPage() {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [filters, setFilters] = useState({
    startDate: format(subDays(new Date(), 30), "yyyy-MM-dd"),
    endDate: format(new Date(), "yyyy-MM-dd"),
  });

  const fetchReport = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/reports/usage?startDate=${filters.startDate}&endDate=${filters.endDate}`
      );
      const data = await response.json();
      if (data.summary) {
        setReport(data);
      }
    } catch (error) {
      console.error("Error fetching usage report:", error);
      alert("שגיאה בטעינת דוח שימוש");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">דוח שימוש בחדרים</h1>
        <p className="text-gray-500 text-sm mt-1">ניתוח שימוש, תפוסות ורווחיות</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">מתאריך</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">עד תאריך</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={fetchReport}
              disabled={loading}
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? "טוען..." : "טען דוח"}
            </button>
          </div>
        </div>
      </div>

      {/* Summary */}
      {report && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <BarChart3 className="w-5 h-5 text-indigo-600" />
                <div className="text-sm text-gray-600">סה"כ הזמנות</div>
              </div>
              <div className="text-3xl font-bold text-gray-900">{report.summary.totalBookings}</div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <div className="text-sm text-gray-600">סה"כ שעות</div>
              </div>
              <div className="text-3xl font-bold text-gray-900">{report.summary.totalHours}</div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                <div className="text-sm text-gray-600">סה"כ הכנסות</div>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                ₪{report.summary.totalRevenue.toFixed(0)}
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                <div className="text-sm text-gray-600">תפוסות ממוצעת</div>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {report.summary.averageOccupancyRate.toFixed(1)}%
              </div>
            </div>
          </div>

          {/* Rooms Table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">ניתוח לפי חדר</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-sm font-medium text-gray-700">חדר</th>
                    <th className="px-6 py-4 text-sm font-medium text-gray-700">הזמנות</th>
                    <th className="px-6 py-4 text-sm font-medium text-gray-700">שעות</th>
                    <th className="px-6 py-4 text-sm font-medium text-gray-700">הכנסות</th>
                    <th className="px-6 py-4 text-sm font-medium text-gray-700">קרדיטים</th>
                    <th className="px-6 py-4 text-sm font-medium text-gray-700">שעת שיא</th>
                    <th className="px-6 py-4 text-sm font-medium text-gray-700">תפוסות</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {report.rooms.map((room: any) => (
                    <tr key={room.roomId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{room.roomName}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{room.totalBookings}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{room.totalHours}</td>
                      <td className="px-6 py-4 text-sm font-medium text-green-600">
                        ₪{room.totalRevenue.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{room.totalCredits}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{room.peakHour}:00</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {room.occupancyRate.toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

