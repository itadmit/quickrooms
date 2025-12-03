"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Copy, Check } from "lucide-react";

interface Webhook {
  id: string;
  url: string;
  events: string;
  enabled: boolean;
  secret: string;
  createdAt: string;
}

export default function WebhooksPage() {
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetchWebhooks();
  }, []);

  const fetchWebhooks = async () => {
    try {
      const response = await fetch("/api/webhooks");
      const data = await response.json();
      setWebhooks(data.webhooks || []);
    } catch (error) {
      console.error("Error fetching webhooks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopySecret = (secret: string, id: string) => {
    navigator.clipboard.writeText(secret);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
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
          <h1 className="text-2xl font-bold text-gray-900">Webhooks</h1>
          <p className="text-gray-500 text-sm mt-1">הגדר Webhooks לאירועים במערכת</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Webhook חדש
        </button>
      </div>

      {webhooks.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <p className="text-gray-500">אין Webhooks מוגדרים</p>
        </div>
      ) : (
        <div className="space-y-4">
          {webhooks.map((webhook) => {
            const events = JSON.parse(webhook.events || "[]");
            return (
              <div
                key={webhook.id}
                className="bg-white rounded-xl border border-gray-200 p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{webhook.url}</h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          webhook.enabled
                            ? "bg-green-50 text-green-700"
                            : "bg-gray-50 text-gray-700"
                        }`}
                      >
                        {webhook.enabled ? "פעיל" : "לא פעיל"}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mb-3">
                      <div>אירועים: {events.join(", ")}</div>
                      <div className="mt-2">
                        <span className="text-xs text-gray-500">Secret: </span>
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {webhook.secret.substring(0, 20)}...
                        </code>
                        <button
                          onClick={() => handleCopySecret(webhook.secret, webhook.id)}
                          className="mr-2 text-indigo-600 hover:text-indigo-700"
                        >
                          {copiedId === webhook.id ? (
                            <Check className="w-4 h-4 inline" />
                          ) : (
                            <Copy className="w-4 h-4 inline" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={async () => {
                      if (confirm("האם אתה בטוח שברצונך למחוק Webhook זה?")) {
                        try {
                          await fetch(`/api/webhooks/${webhook.id}`, {
                            method: "DELETE",
                          });
                          fetchWebhooks();
                        } catch (error) {
                          console.error("Error deleting webhook:", error);
                        }
                      }
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

