"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowRight,
  User,
  Mail,
  Phone,
  CreditCard,
  Calendar,
  DollarSign,
  FileText,
  MessageSquare,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  Download,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { format } from "date-fns";
import { he } from "date-fns/locale";

interface MemberDetails {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  username: string;
  creditBalance: number;
  allowOveruse: boolean;
  createdAt: string;
  creditPlan: {
    name: string;
    credits: number;
  } | null;
  stats: {
    totalBookings: number;
    totalSpent: number;
    totalCreditsUsed: number;
    activeBookings: number;
  };
}

interface Booking {
  id: string;
  startTime: string;
  endTime: string;
  creditsUsed: number | null;
  priceCharged: number | null;
  paymentStatus: string;
  room: {
    name: string;
  };
}

interface Transaction {
  id: string;
  amount: number;
  paymentMethod: string;
  description: string;
  paymentStatus: string;
  createdAt: string;
}

interface Note {
  id: string;
  content: string;
  createdAt: string;
}

export default function MemberProfilePage() {
  const params = useParams();
  const router = useRouter();
  const memberId = params.memberId as string;

  const [member, setMember] = useState<MemberDetails | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState("");
  const [activeTab, setActiveTab] = useState<"bookings" | "transactions" | "notes">("bookings");

  useEffect(() => {
    fetchMemberData();
  }, [memberId]);

  const fetchMemberData = async () => {
    try {
      const [memberRes, bookingsRes, transactionsRes, notesRes] = await Promise.all([
        fetch(`/api/members/${memberId}`),
        fetch(`/api/members/${memberId}/bookings`),
        fetch(`/api/members/${memberId}/transactions`),
        fetch(`/api/members/${memberId}/notes`),
      ]);

      if (memberRes.ok) {
        const memberData = await memberRes.json();
        setMember(memberData.member);
      }

      if (bookingsRes.ok) {
        const bookingsData = await bookingsRes.json();
        setBookings(bookingsData.bookings || []);
      }

      if (transactionsRes.ok) {
        const transactionsData = await transactionsRes.json();
        setTransactions(transactionsData.transactions || []);
      }

      if (notesRes.ok) {
        const notesData = await notesRes.json();
        setNotes(notesData.notes || []);
      }
    } catch (error) {
      console.error("Error fetching member data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    try {
      const response = await fetch(`/api/members/${memberId}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newNote }),
      });

      if (response.ok) {
        setNewNote("");
        fetchMemberData();
      }
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  if (loading) {
    return (
      <div className="h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">חבר קהילה לא נמצא</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push("/dashboard/owner/members")}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowRight className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">פרופיל חבר קהילה</h1>
          <p className="text-gray-500 text-sm mt-1">מידע מפורט והיסטוריה</p>
        </div>
      </div>

      {/* Member Info Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-24 h-24 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-3xl font-bold border-4 border-indigo-50">
              {member.name.charAt(0)}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{member.name}</h2>
              <p className="text-gray-500">@{member.username}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-700">{member.email}</span>
              </div>
              {member.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-700" dir="ltr">{member.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-700">
                  {member.creditBalance} קרדיטים
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-700">
                  חבר מתאריך {format(new Date(member.createdAt), "dd/MM/yyyy", { locale: he })}
                </span>
              </div>
            </div>

            {member.creditPlan && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium">
                <CreditCard className="w-4 h-4" />
                {member.creditPlan.name} ({member.creditPlan.credits} קרדיטים/חודש)
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-1 gap-4 md:w-48">
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <div className="text-2xl font-bold text-blue-600">{member.stats.totalBookings}</div>
              <div className="text-xs text-blue-700 mt-1">הזמנות</div>
            </div>
            <div className="bg-green-50 rounded-xl p-4 border border-green-100">
              <div className="text-2xl font-bold text-green-600">
                ₪{member.stats.totalSpent.toFixed(0)}
              </div>
              <div className="text-xs text-green-700 mt-1">סה"כ הוצאות</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="border-b border-gray-100">
          <div className="flex">
            <button
              onClick={() => setActiveTab("bookings")}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-all ${
                activeTab === "bookings"
                  ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <Calendar className="w-4 h-4 inline-block ml-2" />
              הזמנות ({bookings.length})
            </button>
            <button
              onClick={() => setActiveTab("transactions")}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-all ${
                activeTab === "transactions"
                  ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <DollarSign className="w-4 h-4 inline-block ml-2" />
              תשלומים ({transactions.length})
            </button>
            <button
              onClick={() => setActiveTab("notes")}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-all ${
                activeTab === "notes"
                  ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <MessageSquare className="w-4 h-4 inline-block ml-2" />
              הערות ({notes.length})
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Bookings Tab */}
          {activeTab === "bookings" && (
            <div className="space-y-3">
              {bookings.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">אין הזמנות עדיין</p>
                </div>
              ) : (
                bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{booking.room.name}</div>
                        <div className="text-sm text-gray-500">
                          {format(new Date(booking.startTime), "dd/MM/yyyy HH:mm", { locale: he })} -{" "}
                          {format(new Date(booking.endTime), "HH:mm", { locale: he })}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {booking.creditsUsed !== null && (
                        <div className="text-sm text-gray-600">
                          {booking.creditsUsed} קרדיטים
                        </div>
                      )}
                      {booking.priceCharged !== null && booking.priceCharged > 0 && (
                        <div className="text-sm font-medium text-green-600">
                          ₪{booking.priceCharged.toFixed(2)}
                        </div>
                      )}
                      {booking.paymentStatus === "COMPLETED" ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <Clock className="w-5 h-5 text-amber-500" />
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Transactions Tab */}
          {activeTab === "transactions" && (
            <div className="space-y-3">
              {transactions.length === 0 ? (
                <div className="text-center py-12">
                  <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">אין תשלומים עדיין</p>
                </div>
              ) : (
                transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        transaction.amount >= 0 
                          ? "bg-green-100 text-green-600" 
                          : "bg-red-100 text-red-600"
                      }`}>
                        {transaction.amount >= 0 ? (
                          <TrendingUp className="w-5 h-5" />
                        ) : (
                          <TrendingDown className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{transaction.description}</div>
                        <div className="text-sm text-gray-500">
                          {format(new Date(transaction.createdAt), "dd/MM/yyyy HH:mm", { locale: he })}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className={`text-lg font-bold ${
                        transaction.amount >= 0 ? "text-green-600" : "text-red-600"
                      }`}>
                        {transaction.amount >= 0 ? "+" : ""}₪{Math.abs(transaction.amount).toFixed(2)}
                      </div>
                      <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                        <Download className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Notes Tab */}
          {activeTab === "notes" && (
            <div className="space-y-4">
              {/* Add Note Form */}
              <form onSubmit={handleAddNote} className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
                <div className="flex gap-3">
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="הוסף הערה חדשה..."
                    rows={3}
                    className="flex-1 px-4 py-3 bg-white border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none resize-none"
                  />
                  <button
                    type="submit"
                    disabled={!newNote.trim()}
                    className="self-end px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </form>

              {/* Notes Timeline */}
              <div className="space-y-3">
                {notes.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">אין הערות עדיין</p>
                  </div>
                ) : (
                  notes.map((note, index) => (
                    <div key={note.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <MessageSquare className="w-4 h-4 text-indigo-600" />
                        </div>
                        {index < notes.length - 1 && (
                          <div className="w-0.5 flex-1 bg-gray-200 mt-2"></div>
                        )}
                      </div>
                      <div className="flex-1 pb-6">
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                          <p className="text-gray-900 whitespace-pre-wrap">{note.content}</p>
                          <p className="text-xs text-gray-500 mt-2">
                            {format(new Date(note.createdAt), "dd/MM/yyyy HH:mm", { locale: he })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

