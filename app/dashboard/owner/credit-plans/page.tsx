"use client";

import { useEffect, useState } from "react";
import { CreditCard, Plus, Users, Trash2, X } from "lucide-react";

interface CreditPlan {
  id: string;
  name: string;
  credits: number;
  members: Array<{
    id: string;
    name: string;
  }>;
}

export default function CreditPlansPage() {
  const [plans, setPlans] = useState<CreditPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    credits: "",
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await fetch("/api/credit-plans");
      const data = await response.json();
      setPlans(data.plans || []);
    } catch (error) {
      console.error("Error fetching credit plans:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/credit-plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowCreateForm(false);
        setFormData({ name: "", credits: "" });
        fetchPlans();
      }
    } catch (error) {
      console.error("Error creating credit plan:", error);
    }
  };

  const handleDelete = async (planId: string) => {
    if (!confirm("האם אתה בטוח שברצונך למחוק חבילה זו?")) return;
    
    try {
      const response = await fetch(`/api/credit-plans/${planId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchPlans();
      }
    } catch (error) {
      console.error("Error deleting credit plan:", error);
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
            חבילות קרדיט
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            נהל חבילות קרדיט חודשיות לחברי הקהילה
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200"
        >
          <Plus className="w-4 h-4" />
          חבילה חדשה
        </button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-1 h-6 bg-indigo-600 rounded-full"></div>
              <h2 className="text-lg font-bold text-gray-900">יצירת חבילת קרדיט חדשה</h2>
            </div>
            <button onClick={() => setShowCreateForm(false)} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                שם החבילה
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                placeholder="למשל: Standard, Premium"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                כמות קרדיטים חודשית
              </label>
              <input
                type="number"
                value={formData.credits}
                onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
                required
                min="1"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                placeholder="20"
              />
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

      {/* Plans Grid */}
      {plans.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="text-gray-900 font-medium mb-1">אין חבילות קרדיט</h3>
          <p className="text-gray-500 text-sm mb-6">צור חבילת קרדיט ראשונה כדי להתחיל</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-6 rounded-xl transition-colors shadow-md inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            צור חבילה ראשונה
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group"
            >
              {/* Header */}
              <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 border-b border-indigo-100">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <CreditCard className="w-6 h-6 text-indigo-600" />
                  </div>
                  <button
                    onClick={() => handleDelete(plan.id)}
                    className="p-2 hover:bg-red-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-indigo-600">{plan.credits}</span>
                  <span className="text-sm text-gray-500">קרדיטים/חודש</span>
                </div>
              </div>

              {/* Body */}
              <div className="p-6">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <Users className="w-4 h-4" />
                  <span>{plan.members.length} חברים משתמשים</span>
                </div>
                
                {plan.members.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">חברים מנויים</p>
                    <div className="flex flex-wrap gap-2">
                      {plan.members.slice(0, 3).map((member) => (
                        <div
                          key={member.id}
                          className="px-2.5 py-1 bg-gray-50 text-gray-600 rounded-full text-xs font-medium border border-gray-100"
                        >
                          {member.name}
                        </div>
                      ))}
                      {plan.members.length > 3 && (
                        <div className="px-2.5 py-1 bg-gray-50 text-gray-400 rounded-full text-xs font-medium border border-gray-100">
                          +{plan.members.length - 3}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
