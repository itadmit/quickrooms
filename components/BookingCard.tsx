"use client";

import { useState } from "react";
import { format } from "date-fns";
import { he } from "date-fns/locale";
import {
  Calendar,
  Clock,
  MapPin,
  QrCode,
  Download,
  Star,
  CheckCircle,
  XCircle,
  Edit2,
  Trash2,
} from "lucide-react";

interface BookingCardProps {
  booking: {
    id: string;
    startTime: string;
    endTime: string;
    hours: number;
    creditsUsed: number | null;
    priceCharged: number | null;
    paymentStatus: string;
    checkedIn: boolean;
    checkedOut: boolean;
    checkedInAt: string | null;
    checkedOutAt: string | null;
    room: {
      id: string;
      name: string;
      images?: string | null;
    };
    rating?: {
      rating: number;
      review: string | null;
    } | null;
  };
  onEdit?: () => void;
  onDelete?: () => void;
  onCheckIn?: () => void;
  onCheckOut?: () => void;
  onRate?: () => void;
  showActions?: boolean;
}

export default function BookingCard({
  booking,
  onEdit,
  onDelete,
  onCheckIn,
  onCheckOut,
  onRate,
  showActions = true,
}: BookingCardProps) {
  const [showQR, setShowQR] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);

  const handleDownloadQR = async () => {
    try {
      const response = await fetch(`/api/bookings/${booking.id}/qr`);
      const data = await response.json();
      setQrCode(data.qrCode);
      setShowQR(true);
    } catch (error) {
      console.error("Error fetching QR code:", error);
    }
  };

  const handleDownloadICS = async () => {
    try {
      const response = await fetch(`/api/bookings/${booking.id}/ics`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `booking-${booking.id}.ics`;
      link.click();
    } catch (error) {
      console.error("Error downloading ICS:", error);
    }
  };

  const isPast = new Date(booking.endTime) < new Date();
  const isUpcoming = new Date(booking.startTime) > new Date();
  const canCheckIn = !booking.checkedIn && !isPast && isUpcoming;
  const canCheckOut = booking.checkedIn && !booking.checkedOut;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-1">{booking.room.name}</h3>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {format(new Date(booking.startTime), "dd/MM/yyyy", { locale: he })}
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {format(new Date(booking.startTime), "HH:mm", { locale: he })} -{" "}
              {format(new Date(booking.endTime), "HH:mm", { locale: he })}
            </div>
          </div>
        </div>
        {booking.rating && (
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < booking.rating!.rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Status Badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        {booking.checkedIn && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
            <CheckCircle className="w-3 h-3" />
            נכנס
          </span>
        )}
        {booking.checkedOut && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
            <XCircle className="w-3 h-3" />
            יצא
          </span>
        )}
        {booking.paymentStatus === "COMPLETED" && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium">
            שולם
          </span>
        )}
      </div>

      {/* Cost */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
        <div className="text-sm text-gray-600">
          {booking.creditsUsed !== null && (
            <span>{booking.creditsUsed} קרדיטים</span>
          )}
          {booking.priceCharged !== null && booking.priceCharged > 0 && (
            <span className="mr-2">₪{booking.priceCharged.toFixed(2)}</span>
          )}
        </div>
        <div className="text-xs text-gray-500">{booking.hours} שעות</div>
      </div>

      {/* Actions */}
      {showActions && (
        <div className="flex flex-wrap gap-2">
          {canCheckIn && onCheckIn && (
            <button
              onClick={onCheckIn}
              className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors"
            >
              <CheckCircle className="w-4 h-4" />
              Check-in
            </button>
          )}
          {canCheckOut && onCheckOut && (
            <button
              onClick={onCheckOut}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
            >
              <XCircle className="w-4 h-4" />
              Check-out
            </button>
          )}
          {!booking.rating && isPast && onRate && (
            <button
              onClick={onRate}
              className="flex items-center gap-2 px-3 py-1.5 bg-yellow-50 text-yellow-700 rounded-lg text-sm font-medium hover:bg-yellow-100 transition-colors"
            >
              <Star className="w-4 h-4" />
              דרג
            </button>
          )}
          <button
            onClick={handleDownloadQR}
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
          >
            <QrCode className="w-4 h-4" />
            QR
          </button>
          <button
            onClick={handleDownloadICS}
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
          >
            <Download className="w-4 h-4" />
            Calendar
          </button>
          {onEdit && (
            <button
              onClick={onEdit}
              className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              ערוך
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-700 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              בטל
            </button>
          )}
        </div>
      )}

      {/* QR Code Modal */}
      {showQR && qrCode && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">QR Code להזמנה</h3>
              <button
                onClick={() => setShowQR(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="flex justify-center mb-4">
              <img src={qrCode} alt="QR Code" className="w-64 h-64" />
            </div>
            <button
              onClick={() => {
                const link = document.createElement("a");
                link.href = qrCode;
                link.download = `qr-${booking.id}.png`;
                link.click();
              }}
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              הורד תמונה
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

