"use client";

import { useEffect, useState } from "react";
import { Building2, Clock, CreditCard, Bell, Save, Loader2, Wallet, Info, Mail } from "lucide-react";

interface OwnerSettings {
  businessName: string;
  email: string;
  phone: string;
  address: string;
  minBookingMinutes: number;
  timeIntervalMinutes: number;
  cancellationHours: number;
  autoApprove: boolean;
  allowOveruse: boolean;
  overuseFeePercent: number;
  notifyNewBooking: boolean;
  notifyCancellation: boolean;
  notifyUpcoming: boolean;
  // Payment Settings
  paymeSellerId: string;
  paymeEnvironment: 'sandbox' | 'production';
  paymeWebhookSecret: string;
  paymentEnabled: boolean;
  // Email Settings
  smtpHost: string;
  smtpPort: number;
  smtpSecure: boolean;
  smtpUser: string;
  smtpPass: string;
  emailEnabled: boolean;
}

export default function OwnerSettingsPage() {
  const [settings, setSettings] = useState<OwnerSettings>({
    businessName: "",
    email: "",
    phone: "",
    address: "",
    minBookingMinutes: 60,
    timeIntervalMinutes: 30,
    cancellationHours: 24,
    autoApprove: true,
    allowOveruse: false,
    overuseFeePercent: 20,
    notifyNewBooking: true,
    notifyCancellation: true,
    notifyUpcoming: true,
    paymeSellerId: "",
    paymeEnvironment: 'sandbox',
    paymeWebhookSecret: "",
    paymentEnabled: false,
    smtpHost: "smtp.gmail.com",
    smtpPort: 587,
    smtpSecure: false,
    smtpUser: "",
    smtpPass: "",
    emailEnabled: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/settings/owner");
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
    try {
      const response = await fetch("/api/settings/owner", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'ההגדרות נשמרו בהצלחה!' });
      } else {
        setMessage({ type: 'error', text: 'שגיאה בשמירת ההגדרות' });
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
        <h1 className="text-2xl font-bold text-gray-900">הגדרות מערכת</h1>
        <p className="text-gray-500 text-sm mt-1">נהל את ההגדרות העסקיות והטכניות של המערכת</p>
      </div>

      {/* Success/Error Message */}
      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {message.text}
        </div>
      )}

      {/* Business Settings */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-gray-900">פרטי עסק</h2>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">שם עסק</label>
            <input
              type="text"
              value={settings.businessName}
              onChange={(e) => setSettings({ ...settings, businessName: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              placeholder="Quick Room Management"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">אימייל</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                placeholder="info@quickrooms.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">טלפון</label>
              <input
                type="tel"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                placeholder="03-1234567"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">כתובת</label>
            <input
              type="text"
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              placeholder="רחוב ראשי 123, תל אביב"
            />
          </div>
        </div>
      </div>

      {/* Booking Settings */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-gray-900">הגדרות הזמנות</h2>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">זמן מינימלי להזמנה</label>
              <select
                value={settings.minBookingMinutes}
                onChange={(e) => setSettings({ ...settings, minBookingMinutes: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value={30}>30 דקות</option>
                <option value={60}>60 דקות</option>
                <option value={90}>90 דקות</option>
                <option value={120}>120 דקות</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">מרווחי זמן</label>
              <select
                value={settings.timeIntervalMinutes}
                onChange={(e) => setSettings({ ...settings, timeIntervalMinutes: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value={15}>15 דקות</option>
                <option value={30}>30 דקות</option>
                <option value={60}>60 דקות</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">זמן ביטול מינימלי</label>
              <select
                value={settings.cancellationHours}
                onChange={(e) => setSettings({ ...settings, cancellationHours: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value={24}>24 שעות</option>
                <option value={48}>48 שעות</option>
                <option value={72}>72 שעות</option>
              </select>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="text-sm font-medium text-gray-900">אישור אוטומטי להזמנות</div>
              <div className="text-xs text-gray-500 mt-1">הזמנות יאושרו אוטומטית ללא צורך באישור ידני</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoApprove}
                onChange={(e) => setSettings({ ...settings, autoApprove: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Credit Settings */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-gray-900">הגדרות קרדיט</h2>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="text-sm font-medium text-gray-900">אפשר חריגת קרדיט</div>
              <div className="text-xs text-gray-500 mt-1">חברים יוכלו להזמין גם אם אין להם מספיק קרדיטים</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.allowOveruse}
                onChange={(e) => setSettings({ ...settings, allowOveruse: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
          {settings.allowOveruse && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">אחוז עמלה על חריגה (%)</label>
              <input
                type="number"
                value={settings.overuseFeePercent}
                onChange={(e) => setSettings({ ...settings, overuseFeePercent: Number(e.target.value) })}
                className="w-full md:w-48 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                min="0"
                max="100"
              />
            </div>
          )}
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-gray-900">התראות</h2>
          </div>
        </div>
        <div className="p-6 space-y-3">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="text-sm font-medium text-gray-900">התראות על הזמנות חדשות</div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifyNewBooking}
                onChange={(e) => setSettings({ ...settings, notifyNewBooking: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="text-sm font-medium text-gray-900">התראות על ביטולים</div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifyCancellation}
                onChange={(e) => setSettings({ ...settings, notifyCancellation: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="text-sm font-medium text-gray-900">תזכורות להזמנות קרובות</div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifyUpcoming}
                onChange={(e) => setSettings({ ...settings, notifyUpcoming: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Payment Settings */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-gray-900">הגדרות תשלום (QuickPayment)</h2>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="text-sm font-medium text-gray-900">הפעל תשלומים</div>
              <div className="text-xs text-gray-500 mt-1">אפשר תשלום עבור חריגות קרדיט</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.paymentEnabled}
                onChange={(e) => setSettings({ ...settings, paymentEnabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          {settings.paymentEnabled && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PayMe Seller ID
                  <span className="text-red-500 mr-1">*</span>
                </label>
                <input
                  type="text"
                  value={settings.paymeSellerId}
                  onChange={(e) => setSettings({ ...settings, paymeSellerId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  placeholder="MPL########-########-########-########"
                />
                <p className="text-xs text-gray-500 mt-1">קבל את ה-Seller ID מ-PayMe Dashboard</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  סביבת עבודה
                  <span className="text-red-500 mr-1">*</span>
                </label>
                <select
                  value={settings.paymeEnvironment}
                  onChange={(e) => setSettings({ ...settings, paymeEnvironment: e.target.value as 'sandbox' | 'production' })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                >
                  <option value="sandbox">Sandbox (בדיקות)</option>
                  <option value="production">Production (פרודקשן)</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">השתמש ב-Sandbox לבדיקות, Production לפרודקשן</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Webhook Secret
                  <span className="text-red-500 mr-1">*</span>
                </label>
                <input
                  type="password"
                  value={settings.paymeWebhookSecret}
                  onChange={(e) => setSettings({ ...settings, paymeWebhookSecret: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  placeholder="הזן את ה-Webhook Secret"
                />
                <p className="text-xs text-gray-500 mt-1">Secret key לאימות webhooks מ-PayMe</p>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">הוראות הגדרה:</p>
                    <ol className="list-decimal list-inside space-y-1 text-xs">
                      <li>התחבר ל-<a href="https://dashboard.payme.io" target="_blank" rel="noopener noreferrer" className="underline">PayMe Dashboard</a></li>
                      <li>לך ל-Settings → API Keys והעתק את ה-Seller ID</li>
                      <li>הגדר Webhook URL: <code className="bg-blue-100 px-1 rounded">{typeof window !== 'undefined' ? window.location.origin : 'YOUR_DOMAIN'}/api/payments/webhook</code></li>
                      <li>העתק את ה-Webhook Secret שניתן לך</li>
                    </ol>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Email Settings */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-gray-900">הגדרות אימייל (SMTP)</h2>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="text-sm font-medium text-gray-900">הפעל שליחת אימיילים</div>
              <div className="text-xs text-gray-500 mt-1">שלח אימיילים אוטומטיים ל-Members (תזכורות, אישורים וכו&apos;)</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.emailEnabled}
                onChange={(e) => setSettings({ ...settings, emailEnabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          {settings.emailEnabled && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SMTP Host
                  <span className="text-red-500 mr-1">*</span>
                </label>
                <input
                  type="text"
                  value={settings.smtpHost}
                  onChange={(e) => setSettings({ ...settings, smtpHost: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  placeholder="smtp.gmail.com"
                />
                <p className="text-xs text-gray-500 mt-1">שרת SMTP (למשל: smtp.gmail.com)</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SMTP Port
                    <span className="text-red-500 mr-1">*</span>
                  </label>
                  <input
                    type="number"
                    value={settings.smtpPort}
                    onChange={(e) => setSettings({ ...settings, smtpPort: parseInt(e.target.value) || 587 })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    placeholder="587"
                  />
                  <p className="text-xs text-gray-500 mt-1">פורט SMTP (587 ל-TLS, 465 ל-SSL)</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Secure (SSL/TLS)
                  </label>
                  <label className="relative inline-flex items-center cursor-pointer mt-2">
                    <input
                      type="checkbox"
                      checked={settings.smtpSecure}
                      onChange={(e) => setSettings({ ...settings, smtpSecure: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                  <p className="text-xs text-gray-500 mt-1">הפעל עבור פורט 465 (SSL)</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SMTP Username (Email)
                  <span className="text-red-500 mr-1">*</span>
                </label>
                <input
                  type="email"
                  value={settings.smtpUser}
                  onChange={(e) => setSettings({ ...settings, smtpUser: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  placeholder="your-email@gmail.com"
                />
                <p className="text-xs text-gray-500 mt-1">כתובת האימייל שלך</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SMTP Password (App Password)
                  <span className="text-red-500 mr-1">*</span>
                </label>
                <input
                  type="password"
                  value={settings.smtpPass}
                  onChange={(e) => setSettings({ ...settings, smtpPass: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  placeholder="הזן App Password"
                />
                <p className="text-xs text-gray-500 mt-1">App Password מ-Google (לא הסיסמה הרגילה!)</p>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">הוראות הגדרת Google SMTP:</p>
                    <ol className="list-decimal list-inside space-y-1 text-xs">
                      <li>היכנס ל-<a href="https://myaccount.google.com/security" target="_blank" rel="noopener noreferrer" className="underline">Google Account Security</a></li>
                      <li>הפעל <strong>2-Step Verification</strong> (אם לא מופעל)</li>
                      <li>לך ל-<a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noopener noreferrer" className="underline">App Passwords</a></li>
                      <li>בחר &quot;Mail&quot; ו-&quot;Other (Custom name)&quot;</li>
                      <li>הזן שם: &quot;Quick Rooms&quot;</li>
                      <li>העתק את ה-App Password (16 תווים) והזן אותו למעלה</li>
                    </ol>
                    <p className="mt-2 text-xs font-medium">הערה: השתמש ב-App Password ולא בסיסמה הרגילה!</p>
                  </div>
                </div>
              </div>
            </>
          )}
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

