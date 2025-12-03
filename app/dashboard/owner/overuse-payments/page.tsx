"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { he } from "date-fns/locale";
import { DollarSign, AlertCircle, CheckCircle2, Clock, Calendar, User, CreditCard } from "lucide-react";

interface OverusePayment {
  id: string;
  booking: {
    id: string;
    room: {
      name: string;
    };
    member: {
      name: string;
      email: string;
    } | null;
    guestEmail: string | null;
    startTime: string;
    hours: number;
  } | null;
  amount: number;
  currency: string;
  paymentStatus: string;
  paypalId: string | null;
  createdAt: string;
}

export default function OverusePaymentsPage() {
  const [payments, setPayments] = useState<OverusePayment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await fetch("/api/transactions?type=overuse");
      const data = await response.json();
      setPayments(data.transactions || []);
    } catch (error) {
      console.error("Error fetching payments:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const totalAmount = payments.reduce((acc, p) => acc + p.amount, 0);
  const completedPayments = payments.filter(p => p.paymentStatus === "COMPLETED").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            הזמנות חריגות ותשלומי PayPal
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            נהל תשלומים עבור הזמנות שחרגו מיכולת הקרדיט
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">סה"כ הכנסות</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">₪{totalAmount.toFixed(2)}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">סה"כ תשלומים</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{payments.length}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">הושלמו</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{completedPayments}</p>
        </div>
      </div>

      {/* Payments Table */}
      {payments.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="text-gray-900 font-medium mb-1">אין תשלומי חריגה עדיין</h3>
          <p className="text-gray-500 text-sm">תשלומי PayPal יופיעו כאן כשחברים יחרגו מהקרדיט החודשי</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="bg-gray-50/50 text-xs text-gray-500 uppercase font-medium border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">תאריך</th>
                  <th className="px-6 py-4">משתמש</th>
                  <th className="px-6 py-4">חדר</th>
                  <th className="px-6 py-4">שעות</th>
                  <th className="px-6 py-4">סכום</th>
                  <th className="px-6 py-4">סטטוס</th>
                  <th className="px-6 py-4">PAYPAL ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {payments.map((payment) => {
                  // Handle case where booking might be null
                  if (!payment.booking) {
                    return (
                      <tr key={payment.id} className="hover:bg-gray-50/80 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-gray-900">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            {format(new Date(payment.createdAt), "dd/MM/yyyy", { locale: he })}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-400">-</td>
                        <td className="px-6 py-4 text-gray-400">-</td>
                        <td className="px-6 py-4 text-gray-400">-</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium border border-emerald-100">
                            <DollarSign className="w-3 h-3" />
                            {payment.currency === "USD" ? "$" : "₪"}{payment.amount.toFixed(2)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                            payment.paymentStatus === "COMPLETED"
                              ? "bg-green-50 text-green-700 border-green-100"
                              : payment.paymentStatus === "PENDING"
                              ? "bg-amber-50 text-amber-700 border-amber-100"
                              : "bg-red-50 text-red-700 border-red-100"
                          }`}>
                            {payment.paymentStatus === "COMPLETED" && <CheckCircle2 className="w-3 h-3" />}
                            {payment.paymentStatus === "PENDING" && <Clock className="w-3 h-3" />}
                            {payment.paymentStatus === "FAILED" && <AlertCircle className="w-3 h-3" />}
                            {payment.paymentStatus === "COMPLETED" ? "הושלם" : payment.paymentStatus === "PENDING" ? "ממתין" : "נכשל"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {payment.paypalId ? (
                            <code className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded border border-gray-100 font-mono">
                              {payment.paypalId.substring(0, 12)}...
                            </code>
                          ) : (
                            <span className="text-gray-400 text-xs">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  }

                  return (
                    <tr key={payment.id} className="hover:bg-gray-50/80 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-900">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {format(new Date(payment.createdAt), "dd/MM/yyyy", { locale: he })}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-xs border border-purple-100">
                            {payment.booking.member 
                              ? payment.booking.member.name.charAt(0) 
                              : "A"}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {payment.booking.member?.name || "אורח"}
                            </div>
                            <div className="text-xs text-gray-500">
                              {payment.booking.member?.email || payment.booking.guestEmail}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-900 font-medium">
                        {payment.booking.room.name}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium border border-purple-100">
                          <Clock className="w-3 h-3" />
                          {payment.booking.hours} שעות
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium border border-emerald-100">
                          <DollarSign className="w-3 h-3" />
                          {payment.currency === "USD" ? "$" : "₪"}{payment.amount.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                          payment.paymentStatus === "COMPLETED"
                            ? "bg-green-50 text-green-700 border-green-100"
                            : payment.paymentStatus === "PENDING"
                            ? "bg-amber-50 text-amber-700 border-amber-100"
                            : "bg-red-50 text-red-700 border-red-100"
                        }`}>
                          {payment.paymentStatus === "COMPLETED" && <CheckCircle2 className="w-3 h-3" />}
                          {payment.paymentStatus === "PENDING" && <Clock className="w-3 h-3" />}
                          {payment.paymentStatus === "FAILED" && <AlertCircle className="w-3 h-3" />}
                          {payment.paymentStatus === "COMPLETED" ? "הושלם" : payment.paymentStatus === "PENDING" ? "ממתין" : "נכשל"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {payment.paypalId ? (
                          <code className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded border border-gray-100 font-mono">
                            {payment.paypalId.substring(0, 12)}...
                          </code>
                        ) : (
                          <span className="text-gray-400 text-xs">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
