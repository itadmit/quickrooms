"use client";

import { useEffect, useState } from "react";
import { format, subDays } from "date-fns";
import { BarChart3 } from "lucide-react";

export default function HeatmapPage() {
  const [loading, setLoading] = useState(false);
  const [heatmapData, setHeatmapData] = useState<any>(null);
  const [filters, setFilters] = useState({
    startDate: format(subDays(new Date(), 30), "yyyy-MM-dd"),
    endDate: format(new Date(), "yyyy-MM-dd"),
  });

  const fetchHeatmap = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/reports/heatmap?startDate=${filters.startDate}&endDate=${filters.endDate}`
      );
      const data = await response.json();
      if (data.heatmap) {
        setHeatmapData(data.heatmap);
      }
    } catch (error) {
      console.error("Error fetching heatmap:", error);
      alert("שגיאה בטעינת מפת חום");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHeatmap();
  }, []);

  const getIntensityColor = (intensity: number) => {
    if (intensity === 0) return "bg-gray-100";
    if (intensity < 0.25) return "bg-green-100";
    if (intensity < 0.5) return "bg-yellow-100";
    if (intensity < 0.75) return "bg-orange-100";
    return "bg-red-100";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">מפת חום שימוש בחדרים</h1>
        <p className="text-gray-500 text-sm mt-1">ניתוח ויזואלי של שעות שיא ותפוסות</p>
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
              onClick={fetchHeatmap}
              disabled={loading}
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? "טוען..." : "טען מפת חום"}
            </button>
          </div>
        </div>
      </div>

      {/* Heatmap */}
      {heatmapData && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">מפת חום לפי שעות</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-sm font-medium text-gray-700">שעה</th>
                  {heatmapData.days.map((day: string) => (
                    <th key={day} className="px-4 py-2 text-sm font-medium text-gray-700">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {heatmapData.hours.map((hour: number) => (
                  <tr key={hour}>
                    <td className="px-4 py-2 text-sm font-medium text-gray-700">
                      {hour.toString().padStart(2, "0")}:00
                    </td>
                    {heatmapData.days.map((day: string) => {
                      const intensity =
                        heatmapData.data[day]?.[hour] || 0;
                      return (
                        <td
                          key={`${day}-${hour}`}
                          className={`px-4 py-2 text-center ${getIntensityColor(intensity)}`}
                          title={`${day} ${hour}:00 - ${(intensity * 100).toFixed(0)}% תפוסות`}
                        >
                          <div className="text-xs text-gray-600">
                            {(intensity * 100).toFixed(0)}%
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div className="mt-6 flex items-center gap-4 text-sm">
            <span className="text-gray-600">עוצמה:</span>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-100 rounded"></div>
              <span>0%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-100 rounded"></div>
              <span>1-25%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-100 rounded"></div>
              <span>25-50%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-100 rounded"></div>
              <span>50-75%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-100 rounded"></div>
              <span>75-100%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

