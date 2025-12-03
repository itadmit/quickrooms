"use client";

import { useEffect, useState } from "react";
import { User, Lock, Bell, Heart, Save, Loader2, Mail, Phone, MapPin } from "lucide-react";

interface MemberSettings {
  name: string;
  email: string;
  phone: string;
  address: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  notifyBookingConfirmed: boolean;
  notifyBookingReminder: boolean;
  reminderMinutes: number;
  notifyLowCredits: boolean;
  notifyMonthlyUpdate: boolean;
  favoriteRooms: string[];
  preferredFloors: string[];
}

export default function MemberSettingsPage() {
  const [settings, setSettings] = useState<MemberSettings>({
    name: "",
    email: "",
    phone: "",
    address: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    notifyBookingConfirmed: true,
    notifyBookingReminder: true,
    reminderMinutes: 30,
    notifyLowCredits: true,
    notifyMonthlyUpdate: false,
    favoriteRooms: [],
    preferredFloors: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/settings/member");
      if (response.ok) {
        const data = await response.json();
        setSettings({ ...settings, ...data.settings });
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    // Validate password change
    if (settings.newPassword && settings.newPassword !== settings.confirmPassword) {
      setMessage({ type: 'error', text: 'הסיסמאות אינן תואמות' });
      setSaving(false);
      return;
    }

    try {
      const response = await fetch("/api/settings/member", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'ההגדרות נשמרו בהצלחה!' });
        // Clear password fields
        setSettings({ 
          ...settings, 
          currentPassword: '', 
          newPassword: '', 
          confirmPassword: '' 
        });
      } else {
        const data = await response.json();
        setMessage({ type: 'error', text: data.error || 'שגיאה בשמירת ההגדרות' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'שגיאה בשמירת ההגדרות' });
    } finally {
      setSaving(false);
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
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">הגדרות חשבון</h1>
        <p className="text-gray-500 text-sm mt-1">נהל את הפרטים האישיים וההעדפות שלך</p>
      </div>

      {/* Success/Error Message */}
      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {message.text}
        </div>
      )}

      {/* Personal Info */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-gray-900">פרטים אישיים</h2>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">שם מלא</label>
            <input
              type="text"
              value={settings.name}
              onChange={(e) => setSettings({ ...settings, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              placeholder="דניאל כהן"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  אימייל
                </div>
              </label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                placeholder="daniel@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  טלפון
                </div>
              </label>
              <input
                type="tel"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                placeholder="050-1234567"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                כתובת
              </div>
            </label>
            <input
              type="text"
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              placeholder="רחוב ראשי 123, תל אביב (אופציונלי)"
            />
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-gray-900">סיסמה ואבטחה</h2>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">סיסמה נוכחית</label>
            <input
              type="password"
              value={settings.currentPassword}
              onChange={(e) => setSettings({ ...settings, currentPassword: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              placeholder="הזן סיסמה נוכחית"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">סיסמה חדשה</label>
              <input
                type="password"
                value={settings.newPassword}
                onChange={(e) => setSettings({ ...settings, newPassword: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                placeholder="סיסמה חדשה"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">אימות סיסמה</label>
              <input
                type="password"
                value={settings.confirmPassword}
                onChange={(e) => setSettings({ ...settings, confirmPassword: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                placeholder="הזן שוב סיסמה חדשה"
              />
            </div>
          </div>
          <p className="text-xs text-gray-500">
            השאר ריק אם אינך רוצה לשנות את הסיסמה
          </p>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-gray-900">התראות</h2>
          </div>
        </div>
        <div className="p-6 space-y-3">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="text-sm font-medium text-gray-900">אישור הזמנה</div>
              <div className="text-xs text-gray-500 mt-1">קבל התראה כשההזמנה שלך מאושרת</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifyBookingConfirmed}
                onChange={(e) => setSettings({ ...settings, notifyBookingConfirmed: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="text-sm font-medium text-gray-900">תזכורות לפגישות</div>
              <div className="text-xs text-gray-500 mt-1">קבל תזכורת לפני הפגישה</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifyBookingReminder}
                onChange={(e) => setSettings({ ...settings, notifyBookingReminder: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          {settings.notifyBookingReminder && (
            <div className="pr-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">זמן תזכורת</label>
              <select
                value={settings.reminderMinutes}
                onChange={(e) => setSettings({ ...settings, reminderMinutes: Number(e.target.value) })}
                className="w-full md:w-48 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value={15}>15 דקות לפני</option>
                <option value={30}>30 דקות לפני</option>
                <option value={60}>שעה לפני</option>
                <option value={120}>שעתיים לפני</option>
              </select>
            </div>
          )}

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="text-sm font-medium text-gray-900">קרדיטים נמוכים</div>
              <div className="text-xs text-gray-500 mt-1">התראה כשהקרדיטים שלך נמוכים</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifyLowCredits}
                onChange={(e) => setSettings({ ...settings, notifyLowCredits: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="text-sm font-medium text-gray-900">עדכון חודשי</div>
              <div className="text-xs text-gray-500 mt-1">קבל סיכום חודשי של השימוש שלך</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifyMonthlyUpdate}
                onChange={(e) => setSettings({ ...settings, notifyMonthlyUpdate: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-gray-900">העדפות</h2>
          </div>
        </div>
        <div className="p-6">
          <p className="text-sm text-gray-500">
            ההעדפות שלך נשמרות אוטומטית בעת ביצוע הזמנות. חדרים וקומות מועדפים יוצגו ראשונים בתוצאות החיפוש.
          </p>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {saving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              שומר...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              שמור הגדרות
            </>
          )}
        </button>
      </div>
    </div>
  );
}

