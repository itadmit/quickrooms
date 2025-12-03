"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, ToggleLeft, ToggleRight } from "lucide-react";

interface AutomationRule {
  id: string;
  name: string;
  trigger: string;
  conditions: string;
  actions: string;
  enabled: boolean;
}

export default function AutomationPage() {
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      const response = await fetch("/api/automation");
      const data = await response.json();
      setRules(data.rules || []);
    } catch (error) {
      console.error("Error fetching automation rules:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (ruleId: string, enabled: boolean) => {
    try {
      const response = await fetch(`/api/automation/${ruleId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: !enabled }),
      });

      if (response.ok) {
        fetchRules();
      }
    } catch (error) {
      console.error("Error toggling rule:", error);
    }
  };

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">כללי אוטומציה</h1>
          <p className="text-gray-500 text-sm mt-1">הגדר פעולות אוטומטיות לפי תנאים</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          כלל חדש
        </button>
      </div>

      {rules.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <p className="text-gray-500">אין כללי אוטומציה</p>
        </div>
      ) : (
        <div className="space-y-4">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className="bg-white rounded-xl border border-gray-200 p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{rule.name}</h3>
                    <button
                      onClick={() => handleToggle(rule.id, rule.enabled)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {rule.enabled ? (
                        <ToggleRight className="w-6 h-6 text-green-600" />
                      ) : (
                        <ToggleLeft className="w-6 h-6" />
                      )}
                    </button>
                  </div>
                  <div className="text-sm text-gray-600">
                    <div>טריגר: {rule.trigger}</div>
                    <div>תנאים: {rule.conditions}</div>
                    <div>פעולות: {rule.actions}</div>
                  </div>
                </div>
                <button
                  onClick={async () => {
                    if (confirm("האם אתה בטוח שברצונך למחוק כלל זה?")) {
                      try {
                        await fetch(`/api/automation/${rule.id}`, {
                          method: "DELETE",
                        });
                        fetchRules();
                      } catch (error) {
                        console.error("Error deleting rule:", error);
                      }
                    }
                  }}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

