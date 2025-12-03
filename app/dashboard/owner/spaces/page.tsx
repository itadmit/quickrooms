"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Building2, MapPin, Image as ImageIcon, ArrowLeft, X } from "lucide-react";

interface Space {
  id: string;
  name: string;
  address: string;
  logo: string | null;
  meetingRooms: any[];
}

export default function SpacesPage() {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    logo: "",
  });

  useEffect(() => {
    fetchSpaces();
  }, []);

  const fetchSpaces = async () => {
    try {
      const response = await fetch("/api/spaces");
      const data = await response.json();
      setSpaces(data.spaces || []);
    } catch (error) {
      console.error("Error fetching spaces:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/spaces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowCreateForm(false);
        setFormData({ name: "", address: "", logo: "" });
        fetchSpaces();
      }
    } catch (error) {
      console.error("Error creating space:", error);
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
            ניהול מתחמים
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            צור וערוך מתחמי עבודה וחדרי ישיבות
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200"
        >
          <Plus className="w-4 h-4" />
          מתחם חדש
        </button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-1 h-6 bg-indigo-600 rounded-full"></div>
              <h2 className="text-lg font-bold text-gray-900">יצירת מתחם חדש</h2>
            </div>
            <button onClick={() => setShowCreateForm(false)} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                שם המתחם
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                placeholder="למשל: WeWork Tel Aviv"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                כתובת
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                placeholder="דובנוב 7, תל אביב"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                לוגו (URL)
              </label>
              <input
                type="url"
                value={formData.logo}
                onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                placeholder="https://example.com/logo.png"
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

      {/* Spaces Grid */}
      {spaces.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="text-gray-900 font-medium mb-1">אין מתחמים עדיין</h3>
          <p className="text-gray-500 text-sm mb-6">צור את המתחם הראשון כדי להתחיל</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-6 rounded-xl transition-colors shadow-md inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            צור מתחם ראשון
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {spaces.map((space) => (
            <Link
              key={space.id}
              href={`/dashboard/owner/spaces/${space.id}/rooms`}
              className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              {/* Image/Logo */}
              <div className="aspect-video bg-gray-50 relative overflow-hidden">
                {space.logo ? (
                  <img
                    src={space.logo}
                    alt={space.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                    <ImageIcon className="w-12 h-12 text-gray-300" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                  {space.name}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <MapPin className="w-4 h-4" />
                  {space.address}
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <span className="text-sm text-gray-500">
                    {space.meetingRooms?.length || 0} חדרי ישיבות
                  </span>
                  <div className="flex items-center gap-1 text-indigo-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-all">
                    נהל חדרים
                    <ArrowLeft className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
