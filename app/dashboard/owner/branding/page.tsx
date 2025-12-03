"use client";

import { useEffect, useState } from "react";
import { Upload, Save, Palette } from "lucide-react";

export default function BrandingPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [branding, setBranding] = useState({
    logoUrl: "",
    primaryColor: "#6366f1",
    secondaryColor: "#8b5cf6",
    companyName: "Quick Rooms",
    customDomain: "",
  });

  useEffect(() => {
    fetchBranding();
  }, []);

  const fetchBranding = async () => {
    try {
      const response = await fetch("/api/branding");
      const data = await response.json();
      if (data.branding) {
        setBranding({
          logoUrl: data.branding.logoUrl || "",
          primaryColor: data.branding.primaryColor || "#6366f1",
          secondaryColor: data.branding.secondaryColor || "#8b5cf6",
          companyName: data.branding.companyName || "Quick Rooms",
          customDomain: data.branding.customDomain || "",
        });
      }
    } catch (error) {
      console.error("Error fetching branding:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.url) {
        setBranding({ ...branding, logoUrl: data.url });
      }
    } catch (error) {
      console.error("Error uploading logo:", error);
      alert("שגיאה בהעלאת הלוגו");
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/branding", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(branding),
      });

      if (response.ok) {
        alert("הגדרות Branding נשמרו בהצלחה");
      } else {
        const data = await response.json();
        alert(data.error || "שגיאה בשמירה");
      }
    } catch (error) {
      console.error("Error saving branding:", error);
      alert("שגיאה בשמירה");
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">התאמה אישית (Branding)</h1>
        <p className="text-gray-500 text-sm mt-1">התאם את המראה והשם של המערכת</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
        {/* Logo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            לוגו
          </label>
          <div className="flex items-center gap-4">
            {branding.logoUrl && (
              <img
                src={branding.logoUrl}
                alt="Logo"
                className="w-32 h-32 object-contain border border-gray-200 rounded-lg"
              />
            )}
            <div>
              <label className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg cursor-pointer hover:bg-indigo-100 transition-colors">
                <Upload className="w-4 h-4" />
                העלה לוגו
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-gray-500 mt-2">
                PNG, JPG או SVG. מומלץ 200x200px
              </p>
            </div>
          </div>
        </div>

        {/* Company Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            שם החברה
          </label>
          <input
            type="text"
            value={branding.companyName}
            onChange={(e) => setBranding({ ...branding, companyName: e.target.value })}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Quick Rooms"
          />
        </div>

        {/* Colors */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Palette className="w-4 h-4" />
            צבעים
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-600 mb-1">צבע ראשי</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={branding.primaryColor}
                  onChange={(e) => setBranding({ ...branding, primaryColor: e.target.value })}
                  className="w-16 h-10 rounded border border-gray-200"
                />
                <input
                  type="text"
                  value={branding.primaryColor}
                  onChange={(e) => setBranding({ ...branding, primaryColor: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="#6366f1"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">צבע משני</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={branding.secondaryColor}
                  onChange={(e) => setBranding({ ...branding, secondaryColor: e.target.value })}
                  className="w-16 h-10 rounded border border-gray-200"
                />
                <input
                  type="text"
                  value={branding.secondaryColor}
                  onChange={(e) => setBranding({ ...branding, secondaryColor: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="#8b5cf6"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Custom Domain */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            דומיין מותאם (אופציונלי)
          </label>
          <input
            type="text"
            value={branding.customDomain}
            onChange={(e) => setBranding({ ...branding, customDomain: e.target.value })}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="example.com"
          />
          <p className="text-xs text-gray-500 mt-2">
            הגדר DNS records להפניה לדומיין זה
          </p>
        </div>

        {/* Preview */}
        <div className="pt-6 border-t border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            תצוגה מקדימה
          </label>
          <div
            className="p-6 rounded-lg border-2 border-dashed border-gray-200"
            style={{
              backgroundColor: branding.primaryColor + "10",
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              {branding.logoUrl && (
                <img src={branding.logoUrl} alt="Logo" className="w-12 h-12" />
              )}
              <h2
                className="text-xl font-bold"
                style={{ color: branding.primaryColor }}
              >
                {branding.companyName}
              </h2>
            </div>
            <div className="space-y-2">
              <div
                className="px-4 py-2 rounded-lg text-white"
                style={{ backgroundColor: branding.primaryColor }}
              >
                כפתור ראשי
              </div>
              <div
                className="px-4 py-2 rounded-lg text-white"
                style={{ backgroundColor: branding.secondaryColor }}
              >
                כפתור משני
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4 border-t border-gray-200">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            {saving ? "שומר..." : "שמור שינויים"}
          </button>
        </div>
      </div>
    </div>
  );
}

