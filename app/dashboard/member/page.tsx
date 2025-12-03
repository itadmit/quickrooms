"use client";

import { useEffect, useState } from "react";
import { 
  Calendar, 
  Clock, 
  CreditCard, 
  Building2,
  CheckCircle2,
  AlertCircle,
  Edit2,
  Trash2
} from "lucide-react";
import RoomCard from "@/components/RoomCard";
import BookingModal from "@/components/BookingModal";

interface MemberData {
  id: string;
  name: string;
  email: string;
  username: string;
  creditBalance: number;
  allowOveruse: boolean;
  ownerId: string;
}

interface Room {
  id: string;
  name: string;
  capacity: number;
  creditsPerHour: number;
  pricePerHour: number;
  images: string | null;
  minDurationMinutes?: number;
  timeIntervalMinutes?: number;
  amenities?: string | null;
  description?: string | null;
  specialInstructions?: string | null;
  floor?: string | null;
  space: {
    name: string;
    address: string;
  };
}

interface Booking {
  id: string;
  room: {
    id: string;
    name: string;
    capacity: number;
    images?: string | null;
  };
  startTime: string;
  endTime: string;
  hours: number;
  creditsUsed: number | null;
  priceCharged: number | null;
  paymentStatus: string;
}

export default function MemberDashboard() {
  const [member, setMember] = useState<MemberData | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [cancelBookingId, setCancelBookingId] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    fetchMemberData();
    fetchBookings();
  }, []);

  const fetchMemberData = async () => {
    try {
      const response = await fetch("/api/auth/me");
      if (response.ok) {
        const data = await response.json();
        setMember(data.user);
        // אחרי שיש member, נטען את החדרים
        if (data.user?.ownerId) {
          await fetchRooms(data.user.ownerId);
        }
      }
    } catch (error) {
      console.error("Error fetching member data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRooms = async (ownerId: string) => {
    try {
      // נטען את כל ה-spaces של ה-owner ואז את החדרים
      const spacesResponse = await fetch("/api/spaces");
      if (spacesResponse.ok) {
        const spacesData = await spacesResponse.json();
        const ownerSpaces = spacesData.spaces?.filter((s: any) => s.ownerId === ownerId) || [];
        
        // נטען חדרים מכל space
        const allRooms: Room[] = [];
        for (const space of ownerSpaces) {
          const roomsResponse = await fetch(`/api/rooms?spaceId=${space.id}`);
          if (roomsResponse.ok) {
            const roomsData = await roomsResponse.json();
            allRooms.push(...(roomsData.rooms || []));
          }
        }
        setRooms(allRooms);
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await fetch("/api/bookings");
      if (response.ok) {
        const data = await response.json();
        setBookings(data.bookings || []);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const handleBookingClick = (room: Room) => {
    setSelectedRoom(room);
    setShowBookingModal(true);
  };

  const handleCancelClick = (bookingId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCancelBookingId(bookingId);
    setShowCancelModal(true);
  };

  const handleCancelBooking = async () => {
    if (!cancelBookingId) return;

    try {
      const response = await fetch(`/api/bookings/${cancelBookingId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setShowCancelModal(false);
        setCancelBookingId(null);
        fetchMemberData();
        fetchBookings();
      } else {
        const result = await response.json();
        alert(result.error || "שגיאה בביטול ההזמנה");
      }
    } catch (error) {
      console.error("Error canceling booking:", error);
      alert("שגיאה בביטול ההזמנה");
    }
  };

  const handleBookingSubmit = async (data: { startTime: string; endTime: string }) => {
    if (!selectedRoom || !member) return;

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId: selectedRoom.id,
          startTime: data.startTime,
          endTime: data.endTime,
          memberId: member.id,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        // Success is handled by the modal's success step
        // Don't auto-close, let user close manually
        fetchMemberData();
        fetchBookings();
      } else {
        alert(result.error || "שגיאה בביצוע ההזמנה");
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      throw error;
    }
  };

  // Get existing bookings for the selected room
  const getRoomBookings = () => {
    if (!selectedRoom) return [];
    return bookings
      .filter((b) => b.room.id === selectedRoom.id)
      .map((b) => ({
        startTime: b.startTime,
        endTime: b.endTime,
      }));
  };

  if (loading) {
    return (
      <div className="h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const activeBookings = bookings.filter((b) => new Date(b.endTime) > new Date());

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          ברוך הבא, {member?.name}
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          ניהול הזמנות חדרי ישיבות והקרדיטים שלך
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{member?.creditBalance || 0}</h3>
              <p className="text-xs text-gray-500">יתרת קרדיטים</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-green-600">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{activeBookings.length}</h3>
              <p className="text-xs text-gray-500">הזמנות פעילות</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-violet-50 rounded-lg flex items-center justify-center text-violet-600">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{bookings.length}</h3>
              <p className="text-xs text-gray-500">סך הכל הזמנות</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Rooms Section */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-1 h-6 bg-indigo-600 rounded-full"></div>
              <h2 className="text-lg font-bold text-gray-900">חדרים זמינים</h2>
            </div>
          </div>
          
          {rooms.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-gray-300" />
              </div>
              <h3 className="text-gray-900 font-medium mb-1">אין חדרים זמינים</h3>
              <p className="text-gray-500 text-sm">פנה לבעל המתחם להוספת חדרים.</p>
            </div>
          ) : (
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {rooms.map((room) => (
                <RoomCard
                  key={room.id}
                  room={room}
                  onBook={handleBookingClick}
                  showBookButton={true}
                />
              ))}
            </div>
          )}
        </div>

        {/* Bookings Section */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <div className="flex items-center gap-2">
              <div className="w-1 h-6 bg-indigo-600 rounded-full"></div>
              <h2 className="text-lg font-bold text-gray-900">ההזמנות שלי</h2>
            </div>
          </div>
          
          {bookings.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-6 h-6 text-gray-300" />
              </div>
              <p className="text-gray-500 text-sm">אין הזמנות עדיין</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {bookings.map((booking) => {
                const bookingDate = new Date(booking.startTime);
                const bookingEndDate = new Date(booking.endTime);
                const now = new Date();
                const hoursUntilBooking = (bookingDate.getTime() - now.getTime()) / (1000 * 60 * 60);
                const canEdit = hoursUntilBooking > 24; // Can edit if more than 24 hours before
                const isPast = bookingEndDate < now; // Meeting has passed
                const isCancellable = hoursUntilBooking > 24; // Can cancel
                const imageUrl = booking.room.images 
                  ? (booking.room.images.includes(',') ? booking.room.images.split(',')[0] : booking.room.images)
                  : null;

                return (
                <div
                  key={booking.id}
                  className={`p-4 hover:bg-gray-50 transition-colors ${isPast ? 'opacity-60' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    {/* Room Image */}
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={booking.room.name}
                        className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div className={`w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 ${imageUrl ? 'hidden' : ''}`}>
                      <Building2 className="w-6 h-6 text-gray-300" />
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                      {/* Top Row: Name + Actions */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="text-sm font-semibold text-gray-900">{booking.room.name}</h4>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {!isPast && canEdit && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const fullRoom = rooms.find(r => r.id === booking.room.id);
                                if (fullRoom) {
                                  handleBookingClick(fullRoom);
                                }
                              }}
                              className="p-1.5 hover:bg-indigo-50 rounded-md transition-colors group"
                              title="עריכה"
                            >
                              <Edit2 className="w-4 h-4 text-gray-400 group-hover:text-indigo-600" />
                            </button>
                          )}
                          {!isPast && isCancellable && (
                            <button
                              onClick={(e) => handleCancelClick(booking.id, e)}
                              className="p-1.5 hover:bg-red-50 rounded-md transition-colors group"
                              title="ביטול"
                            >
                              <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-600" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Middle Row: Date & Time */}
                      <div className="flex items-center gap-4 text-xs text-gray-600 mb-2">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                          <span className="whitespace-nowrap">
                            {new Date(booking.startTime).toLocaleDateString("he-IL", {
                              day: "numeric",
                              month: "short",
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                          <span className="whitespace-nowrap">
                            {new Date(booking.startTime).toLocaleTimeString("he-IL", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}-
                            {new Date(booking.endTime).toLocaleTimeString("he-IL", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>

                      {/* Bottom Row: Credits + Status */}
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          {booking.creditsUsed !== null ? (
                            <span className="text-xs font-bold text-indigo-600">
                              {booking.creditsUsed} קרדיטים
                            </span>
                          ) : (
                            <span className="text-xs font-bold text-gray-900">
                              ₪{booking.priceCharged?.toFixed(0)}
                            </span>
                          )}
                        </div>
                        <div>
                          {isPast && (
                            <span className="text-xs px-2 py-0.5 rounded-md font-medium bg-gray-100 text-gray-600">
                              הסתיים
                            </span>
                          )}
                          {!isPast && !isCancellable && (
                            <span className="text-xs px-2 py-0.5 rounded-md font-medium bg-red-50 text-red-600">
                              לא ניתן לביטול
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedRoom && member && (
        <BookingModal
          room={selectedRoom}
          member={member}
          existingBookings={getRoomBookings()}
          onClose={() => {
            setShowBookingModal(false);
            setSelectedRoom(null);
          }}
          onSubmit={handleBookingSubmit}
        />
      )}

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowCancelModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8" onClick={(e) => e.stopPropagation()}>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">האם אתה בטוח?</h3>
            <p className="text-gray-600 mb-6 text-center">
              פעולה זו תבטל את ההזמנה והקרדיטים שנוכו יוחזרו לחשבונך.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowCancelModal(false);
                  setCancelBookingId(null);
                }}
                className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                ביטול
              </button>
              <button
                type="button"
                onClick={handleCancelBooking}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                אישור ביטול
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
