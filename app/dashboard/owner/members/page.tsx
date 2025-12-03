"use client";

import { useEffect, useState } from "react";
import { Plus, Users as UsersIcon, CreditCard, Mail, User, Shield, X } from "lucide-react";

interface Member {
  id: string;
  name: string;
  email: string;
  username: string;
  creditBalance: number;
  allowOveruse: boolean;
  creditPlan: {
    name: string;
    credits: number;
  } | null;
}

interface CreditPlan {
  id: string;
  name: string;
  credits: number;
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [creditPlans, setCreditPlans] = useState<CreditPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showPlanForm, setShowPlanForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    creditPlanId: "",
    allowOveruse: false,
  });
  const [planFormData, setPlanFormData] = useState({
    name: "",
    credits: "",
  });

  useEffect(() => {
    fetchMembers();
    fetchCreditPlans();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await fetch("/api/members");
      const data = await response.json();
      setMembers(data.members || []);
    } catch (error) {
      console.error("Error fetching members:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCreditPlans = async () => {
    try {
      const response = await fetch("/api/credit-plans");
      const data = await response.json();
      setCreditPlans(data.plans || []);
    } catch (error) {
      console.error("Error fetching credit plans:", error);
    }
  };

  const handleMemberSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowCreateForm(false);
        setFormData({
          name: "",
          email: "",
          username: "",
          password: "",
          creditPlanId: "",
          allowOveruse: false,
        });
        fetchMembers();
      }
    } catch (error) {
      console.error("Error creating member:", error);
    }
  };

  const handlePlanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/credit-plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(planFormData),
      });

      if (response.ok) {
        setShowPlanForm(false);
        setPlanFormData({ name: "", credits: "" });
        fetchCreditPlans();
      }
    } catch (error) {
      console.error("Error creating credit plan:", error);
    }
  };

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
            ניהול Members
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            נהל חברי קהילה, חבילות קרדיט והרשאות
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowPlanForm(!showPlanForm)}
            className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
          >
            <CreditCard className="w-4 h-4" />
            חבילת קרדיט חדשה
          </button>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200"
          >
            <Plus className="w-4 h-4" />
            Member חדש
          </button>
        </div>
      </div>

      {/* Credit Plan Form */}
      {showPlanForm && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-1 h-6 bg-green-500 rounded-full"></div>
              <h2 className="text-lg font-bold text-gray-900">יצירת חבילת קרדיט חדשה</h2>
            </div>
            <button onClick={() => setShowPlanForm(false)} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
          <form onSubmit={handlePlanSubmit} className="p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                שם החבילה
              </label>
              <input
                type="text"
                value={planFormData.name}
                onChange={(e) => setPlanFormData({ ...planFormData, name: e.target.value })}
                required
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                placeholder="למשל: חבילת Standard"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                כמות קרדיטים חודשית
              </label>
              <input
                type="number"
                value={planFormData.credits}
                onChange={(e) => setPlanFormData({ ...planFormData, credits: e.target.value })}
                required
                min="1"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                placeholder="20"
              />
            </div>
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-6 rounded-xl transition-colors shadow-md"
            >
              יצירה
            </button>
          </form>
        </div>
      )}

      {/* Member Form */}
      {showCreateForm && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-1 h-6 bg-indigo-600 rounded-full"></div>
              <h2 className="text-lg font-bold text-gray-900">יצירת Member חדש</h2>
            </div>
            <button onClick={() => setShowCreateForm(false)} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
          <form onSubmit={handleMemberSubmit} className="p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  שם מלא
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                  placeholder="שם החבר"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  אימייל
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                  placeholder="name@example.com"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  שם משתמש
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                  placeholder="username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  סיסמה
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                חבילת קרדיט
              </label>
              <select
                value={formData.creditPlanId}
                onChange={(e) => setFormData({ ...formData, creditPlanId: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
              >
                <option value="">ללא חבילה</option>
                {creditPlans.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.name} ({plan.credits} קרדיטים)
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2 p-4 bg-amber-50 border border-amber-100 rounded-xl">
              <input
                type="checkbox"
                id="allowOveruse"
                checked={formData.allowOveruse}
                onChange={(e) => setFormData({ ...formData, allowOveruse: e.target.checked })}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <label htmlFor="allowOveruse" className="text-sm font-medium text-amber-900 flex-1">
                אפשר חריגה מהקרדיט החודשי (תשלום PayPal על החלק החריג)
              </label>
            </div>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-6 rounded-xl transition-colors shadow-md"
            >
              יצירה
            </button>
          </form>
        </div>
      )}

      {/* Members Table */}
      {members.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <UsersIcon className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="text-gray-900 font-medium mb-1">אין Members עדיין</h3>
          <p className="text-gray-500 text-sm mb-6">צור את ה-Member הראשון כדי להתחיל</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-6 rounded-xl transition-colors shadow-md inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            צור Member ראשון
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="bg-gray-50/50 text-xs text-gray-500 uppercase font-medium border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">שם</th>
                  <th className="px-6 py-4">אימייל</th>
                  <th className="px-6 py-4">יתרת קרדיט</th>
                  <th className="px-6 py-4">חבילת קרדיט</th>
                  <th className="px-6 py-4">חריגה מותרת</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {members.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs border border-indigo-100">
                          {member.name.charAt(0)}
                        </div>
                        <span className="font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">
                          {member.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{member.email}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium border border-blue-100">
                        <CreditCard className="w-3 h-3" />
                        {member.creditBalance}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {member.creditPlan
                        ? `${member.creditPlan.name} (${member.creditPlan.credits})`
                        : "ללא"}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                        member.allowOveruse 
                          ? "bg-green-50 text-green-700 border-green-100" 
                          : "bg-gray-50 text-gray-600 border-gray-100"
                      }`}>
                        <Shield className="w-3 h-3" />
                        {member.allowOveruse ? "כן" : "לא"}
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
