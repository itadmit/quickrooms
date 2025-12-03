"use client";

import { useEffect, useState } from "react";
import { Download, FileText, Calendar } from "lucide-react";
import { format } from "date-fns";
import { he } from "date-fns/locale";

export default function TaxReportPage() {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [filters, setFilters] = useState({
    startDate: format(new Date(new Date().getFullYear(), 0, 1), "yyyy-MM-dd"),
    endDate: format(new Date(), "yyyy-MM-dd"),
    vatRate: "17",
  });

  const fetchReport = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/reports/tax?startDate=${filters.startDate}&endDate=${filters.endDate}&vatRate=${filters.vatRate}`
      );
      const data = await response.json();
      if (data.report) {
        setReport(data.report);
      }
    } catch (error) {
      console.error("Error fetching tax report:", error);
      alert("שגיאה בטעינת דוח מס");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const handleExport = () => {
    if (!report) return;

    const csvRows = [
      ["דוח מס ערך מוסף"],
      [`תקופה: ${filters.startDate} - ${filters.endDate}`],
      [""],
      ["סיכום"],
      [`סה"כ הכנסות`, report.summary.totalRevenue],
      [`הכנסות לפני מע"מ`, report.summary.revenueBeforeVat],
      [`שיעור מע"מ`, report.summary.vatRate],
      [`סכום מע"מ`, report.summary.vatAmount],
      [`מספר עסקאות`, report.summary.totalTransactions],
      [""],
      ["פירוט עסקאות"],
      ["תאריך", "סכום", "חדר", "תיאור"],
      ...report.transactions.map((t: any) => [
        t.date,
        t.amount,
        t.room,
        t.description,
      ]),
    ];

    const csv = csvRows.map((row) => row.join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `tax-report-${Date.now()}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">דוח מס ערך מוסף</h1>
        <p className="text-gray-500 text-sm mt-1">דוח מע"מ והכנסות לפי תקופות</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              מתאריך
            </label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              עד תאריך
            </label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              שיעור מע"מ (%)
            </label>
            <input
              type="number"
              value={filters.vatRate}
              onChange={(e) => setFilters({ ...filters, vatRate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              min="0"
              max="100"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={fetchReport}
              disabled={loading}
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {loading ? "טוען..." : "טען דוח"}
            </button>
          </div>
        </div>
      </div>

      {/* Report */}
      {report && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900">סיכום דוח</h2>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              ייצא ל-CSV
            </button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <div className="text-sm text-blue-700 mb-1">סה"כ הכנסות</div>
              <div className="text-2xl font-bold text-blue-900">
                ₪{parseFloat(report.summary.totalRevenue).toLocaleString()}
              </div>
            </div>
            <div className="bg-green-50 rounded-xl p-4 border border-green-100">
              <div className="text-sm text-green-700 mb-1">הכנסות לפני מע"מ</div>
              <div className="text-2xl font-bold text-green-900">
                ₪{parseFloat(report.summary.revenueBeforeVat).toLocaleString()}
              </div>
            </div>
            <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
              <div className="text-sm text-purple-700 mb-1">סכום מע"מ</div>
              <div className="text-2xl font-bold text-purple-900">
                ₪{parseFloat(report.summary.vatAmount).toLocaleString()}
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div className="text-sm text-gray-700 mb-1">מספר עסקאות</div>
              <div className="text-2xl font-bold text-gray-900">
                {report.summary.totalTransactions}
              </div>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-sm font-medium text-gray-700">תאריך</th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-700">סכום</th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-700">חדר</th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-700">תיאור</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {report.transactions.map((transaction: any, index: number) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{transaction.date}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      ₪{transaction.amount}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{transaction.room}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{transaction.description}</td>
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

