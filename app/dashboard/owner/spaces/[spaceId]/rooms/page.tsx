"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Plus, Users, CreditCard, DollarSign, Image as ImageIcon, ArrowRight, X, Wifi, Tv, Coffee, SquarePen, Upload, Loader2 } from "lucide-react";

interface Room {
  id: string;
  name: string;
  capacity: number;
  images: string;
  creditsPerHour: number;
  pricePerHour: number;
  amenities?: string | null;
  description?: string | null;
  floor?: string | null;
}

export default function RoomsPage() {
  const params = useParams();
  const spaceId = params.spaceId as string;
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    capacity: "",
    creditsPerHour: "",
    pricePerHour: "",
    images: "",
    minDurationMinutes: "60",
    timeIntervalMinutes: "30",
    floor: "",
    description: "",
    specialInstructions: "",
    amenities: [] as string[],
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const availableAmenities = [
    { id: "wifi", label: "Wi-Fi", icon: Wifi },
    { id: "tv", label: "TV", icon: Tv },
    { id: "whiteboard", label: "לוח מחיק", icon: SquarePen },
    { id: "coffee", label: "קפה", icon: Coffee },
  ];

  useEffect(() => {
    if (spaceId) {
      fetchRooms();
    }
  }, [spaceId]);

  const fetchRooms = async () => {
    try {
      const response = await fetch(`/api/rooms?spaceId=${spaceId}`);
      const data = await response.json();
      setRooms(data.rooms || []);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('סוג קובץ לא נתמך. אנא העלה תמונה בפורמט JPG, PNG או WebP');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert('גודל הקובץ גדול מדי. מקסימום 5MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    setUploadingImage(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'שגיאה בהעלאת התמונה');
      }

      const { url } = await response.json();
      setFormData({ ...formData, images: url });
    } catch (error) {
      console.error('Error uploading image:', error);
      alert(error instanceof Error ? error.message : 'שגיאה בהעלאת התמונה');
      setImagePreview(null);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
          ...formData,
          spaceId,
          images: formData.images,
          capacity: parseInt(formData.capacity),
          creditsPerHour: parseInt(formData.creditsPerHour),
          pricePerHour: parseFloat(formData.pricePerHour),
          minDurationMinutes: parseInt(formData.minDurationMinutes),
          timeIntervalMinutes: parseInt(formData.timeIntervalMinutes),
          amenities: JSON.stringify(formData.amenities),
        }),
      });

      if (response.ok) {
        setShowCreateForm(false);
        setFormData({
          name: "",
          capacity: "",
          creditsPerHour: "",
          pricePerHour: "",
          images: "",
          minDurationMinutes: "60",
          timeIntervalMinutes: "30",
          floor: "",
          description: "",
          specialInstructions: "",
          amenities: [],
        });
        setImagePreview(null);
        fetchRooms();
      }
    } catch (error) {
      console.error("Error creating room:", error);
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
          <div className="flex items-center gap-3 mb-2">
            <Link
              href="/dashboard/owner/spaces"
              className="text-indigo-600 hover:text-indigo-700 transition-colors flex items-center gap-1 text-sm font-medium"
            >
              <ArrowRight className="w-4 h-4" />
              חזרה למתחמים
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            ניהול חדרים
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            הוסף וערוך חדרי ישיבות במתחם
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200"
        >
          <Plus className="w-4 h-4" />
          חדר חדש
        </button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-1 h-6 bg-indigo-600 rounded-full"></div>
              <h2 className="text-lg font-bold text-gray-900">יצירת חדר חדש</h2>
            </div>
            <button onClick={() => setShowCreateForm(false)} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                שם החדר
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                placeholder="חדר ישיבות A"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  קיבולת (מספר אנשים)
                </label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  required
                  min="1"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                  placeholder="6"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  קרדיטים לשעה
                </label>
                <input
                  type="number"
                  value={formData.creditsPerHour}
                  onChange={(e) => setFormData({ ...formData, creditsPerHour: e.target.value })}
                  required
                  min="1"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                  placeholder="2"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                מחיר לשעה (₪) - לאורחים
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.pricePerHour}
                onChange={(e) => setFormData({ ...formData, pricePerHour: e.target.value })}
                required
                min="0"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                placeholder="50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                תמונה
              </label>
              
              {/* Image Preview */}
              {(imagePreview || formData.images) && (
                <div className="mb-3 relative">
                  <img
                    src={imagePreview || formData.images}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-xl border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      setFormData({ ...formData, images: "" });
                    }}
                    className="absolute top-2 left-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Upload Button */}
              <div className="flex gap-3">
                <label className="flex-1 cursor-pointer">
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploadingImage}
                  />
                  <div className={`flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-50 border-2 border-dashed border-indigo-300 rounded-xl hover:bg-indigo-100 transition-colors ${uploadingImage ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    {uploadingImage ? (
                      <>
                        <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
                        <span className="text-sm font-medium text-indigo-700">מעלה...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5 text-indigo-600" />
                        <span className="text-sm font-medium text-indigo-700">העלה תמונה</span>
                      </>
                    )}
                  </div>
                </label>
              </div>

              {/* URL Input (Alternative) */}
              <div className="mt-3">
                <p className="text-xs text-gray-500 mb-2">או הזן URL:</p>
                <input
                  type="url"
                  value={formData.images}
                  onChange={(e) => {
                    setFormData({ ...formData, images: e.target.value });
                    setImagePreview(e.target.value || null);
                  }}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                  placeholder="https://example.com/room-image.jpg"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                קומה
              </label>
              <input
                type="text"
                value={formData.floor}
                onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                placeholder="קומה 1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                תיאור החדר
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                placeholder="תיאור קצר של החדר, מה מיוחד בו..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                אמניטיז
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {availableAmenities.map((amenity) => {
                  const Icon = amenity.icon;
                  const isSelected = formData.amenities.includes(amenity.id);
                  return (
                    <button
                      key={amenity.id}
                      type="button"
                      onClick={() => {
                        if (isSelected) {
                          setFormData({
                            ...formData,
                            amenities: formData.amenities.filter((a) => a !== amenity.id),
                          });
                        } else {
                          setFormData({
                            ...formData,
                            amenities: [...formData.amenities, amenity.id],
                          });
                        }
                      }}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                        isSelected
                          ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                          : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-xs font-medium">{amenity.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                הנחיות מיוחדות
              </label>
              <textarea
                value={formData.specialInstructions}
                onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
                rows={3}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                placeholder="הנחיות מיוחדות למשתמשים (ביטול, שינוי, כללי התנהגות וכו')"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 border-t border-gray-100 pt-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  מינימום זמן לפגישה (דקות)
                </label>
                <select
                  value={formData.minDurationMinutes}
                  onChange={(e) => setFormData({ ...formData, minDurationMinutes: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                >
                  <option value="15">15 דקות</option>
                  <option value="30">30 דקות</option>
                  <option value="60">שעה אחת</option>
                  <option value="90">שעה וחצי</option>
                  <option value="120">שעתיים</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  קפיצות זמן (דקות)
                </label>
                <select
                  value={formData.timeIntervalMinutes}
                  onChange={(e) => setFormData({ ...formData, timeIntervalMinutes: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                >
                  <option value="15">15 דקות</option>
                  <option value="30">30 דקות</option>
                  <option value="60">60 דקות</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">הזמנות יוכלו להתחיל רק בשעות אלו</p>
              </div>
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

      {/* Rooms Grid */}
      {rooms.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <ImageIcon className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="text-gray-900 font-medium mb-1">אין חדרים במתחם</h3>
          <p className="text-gray-500 text-sm mb-6">הוסף את החדר הראשון כדי להתחיל</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-6 rounded-xl transition-colors shadow-md inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            צור חדר ראשון
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              {/* Image */}
              <div className="aspect-video bg-gray-50 relative overflow-hidden">
                {room.images ? (
                  <img
                    src={room.images.split(",")[0]?.trim()}
                    alt={room.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                    <ImageIcon className="w-12 h-12 text-gray-300" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">
                  {room.name}
                </h3>
                {room.description && (
                  <p className="text-xs text-gray-500 mb-3 line-clamp-2">{room.description}</p>
                )}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Users className="w-4 h-4" />
                      <span>קיבולת</span>
                    </div>
                    <span className="font-medium text-gray-900">{room.capacity} אנשים</span>
                  </div>
                  {room.floor && (
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-gray-500">
                        <span>קומה</span>
                      </div>
                      <span className="font-medium text-gray-900">{room.floor}</span>
                    </div>
                  )}
                  {room.amenities && (() => {
                    try {
                      const amenities = typeof room.amenities === 'string' ? JSON.parse(room.amenities) : room.amenities;
                      if (Array.isArray(amenities) && amenities.length > 0) {
                        return (
                          <div className="flex flex-wrap gap-1.5 pt-2">
                            {amenities.slice(0, 3).map((amenity: string) => (
                              <span key={amenity} className="inline-flex items-center px-2 py-0.5 bg-gray-50 text-gray-600 rounded-full text-xs border border-gray-100">
                                {amenity === 'wifi' && 'Wi-Fi'}
                                {amenity === 'tv' && 'TV'}
                                {amenity === 'whiteboard' && 'לוח מחיק'}
                                {amenity === 'coffee' && 'קפה'}
                                {!['wifi', 'tv', 'whiteboard', 'coffee'].includes(amenity) && amenity}
                              </span>
                            ))}
                            {amenities.length > 3 && (
                              <span className="inline-flex items-center px-2 py-0.5 bg-gray-50 text-gray-500 rounded-full text-xs border border-gray-100">
                                +{amenities.length - 3}
                              </span>
                            )}
                          </div>
                        );
                      }
                    } catch (e) {}
                    return null;
                  })()}
                  <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-gray-500">
                      <CreditCard className="w-4 h-4" />
                      <span>קרדיטים לשעה</span>
                    </div>
                    <span className="inline-flex items-center px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium border border-blue-100 text-xs font-medium">
                      {room.creditsPerHour}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-500">
                      <DollarSign className="w-4 h-4" />
                      <span>מחיר לשעה</span>
                    </div>
                    <span className="inline-flex items-center px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium border border-emerald-100">
                      ₪{room.pricePerHour}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
