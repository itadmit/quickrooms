"use client";

import { useEffect, useState } from "react";
import { 
  Calendar, 
  Clock, 
  Building2, 
  Edit2, 
  Trash2,
  Filter,
  Search,
  Download,
  ChevronDown,
  AlertCircle
} from "lucide-react";
import BookingModal from "@/components/BookingModal";
import BookingCard from "@/components/BookingCard";
import RatingModal from "@/components/RatingModal";
import AdvancedSearch from "@/components/AdvancedSearch";

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

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("date-desc");
  const [cancelBookingId, setCancelBookingId] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [member, setMember] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [bookings, searchQuery, filterStatus, sortBy]);

  const fetchData = async () => {
    try {
      // Fetch member data to get ownerId
      const meResponse = await fetch("/api/auth/me");
      if (meResponse.ok) {
        const meData = await meResponse.json();
        setMember(meData.user);
        if (meData.user?.ownerId) {
          await fetchRooms(meData.user.ownerId);
        }
      }

      // Fetch bookings
      const bookingsResponse = await fetch("/api/bookings");
      if (bookingsResponse.ok) {
        const data = await bookingsResponse.json();
        setBookings(data.bookings || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRooms = async (ownerId: string) => {
    try {
      const spacesResponse = await fetch("/api/spaces");
      if (spacesResponse.ok) {
        const spacesData = await spacesResponse.json();
        const ownerSpaces = spacesData.spaces?.filter((s: any) => s.ownerId === ownerId) || [];
        
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

  const applyFilters = () => {
    let filtered = [...bookings];
    const now = new Date();

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(booking =>
        booking.room.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter(booking => {
        const bookingDate = new Date(booking.startTime);
        const bookingEndDate = new Date(booking.endTime);
        const hoursUntilBooking = (bookingDate.getTime() - now.getTime()) / (1000 * 60 * 60);
        
        switch (filterStatus) {
          case "upcoming":
            return bookingDate > now;
          case "past":
            return bookingEndDate < now;
          case "cancellable":
            return hoursUntilBooking > 24 && bookingDate > now;
          case "today":
            return bookingDate.toDateString() === now.toDateString();
          default:
            return true;
        }
      });
    }

    // Sort
    filtered.sort((a, b) => {
      const dateA = new Date(a.startTime).getTime();
      const dateB = new Date(b.startTime).getTime();
      
      switch (sortBy) {
        case "date-desc":
          return dateB - dateA;
        case "date-asc":
          return dateA - dateB;
        case "room":
          return a.room.name.localeCompare(b.room.name, 'he');
        default:
          return 0;
      }
    });

    setFilteredBookings(filtered);
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
        fetchData();
      } else {
        const result = await response.json();
        alert(result.error || "שגיאה בביטול ההזמנה");
      }
    } catch (error) {
      console.error("Error canceling booking:", error);
      alert("שגיאה בביטול ההזמנה");
    }
  };

  const handleEditClick = (room: Room) => {
    setSelectedRoom(room);
    setShowBookingModal(true);
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
        fetchData();
      } else {
        alert(result.error || "שגיאה בביצוע ההזמנה");
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      throw error;
    }
  };

  const getRoomBookings = () => {
    if (!selectedRoom) return [];
    return bookings
      .filter((b) => b.room.id === selectedRoom.id)
      .map((b) => ({
        startTime: b.startTime,
        endTime: b.endTime,
      }));
  };

  const exportBookings = () => {
    // Create CSV content
    const headers = ["תאריך", "שעה", "חדר", "משך (שעות)", "קרדיטים", "מחיר"];
    const rows = filteredBookings.map(booking => [
      new Date(booking.startTime).toLocaleDateString("he-IL"),
      `${new Date(booking.startTime).toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" })}-${new Date(booking.endTime).toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" })}`,
      booking.room.name,
      booking.hours,
      booking.creditsUsed || 0,
      booking.priceCharged || 0
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    // Download CSV
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `bookings_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const getBookingStats = () => {
    const now = new Date();
    const upcoming = bookings.filter(b => new Date(b.startTime) > now).length;
    const past = bookings.filter(b => new Date(b.endTime) < now).length;
    const today = bookings.filter(b => new Date(b.startTime).toDateString() === now.toDateString()).length;
    const totalHours = bookings.reduce((sum, b) => sum + b.hours, 0);
    
    return { upcoming, past, today, totalHours };
  };

  const stats = getBookingStats();

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ההזמנות שלי</h1>
          <p className="text-gray-500 text-sm mt-1">נהל את כל ההזמנות שלך במקום אחד</p>
        </div>
        <button
          onClick={exportBookings}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
        >
          <Download className="w-4 h-4" />
          ייצוא לקובץ
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <div className="text-xs text-gray-500 mb-1">פגישות קרובות</div>
          <div className="text-2xl font-bold text-indigo-600">{stats.upcoming}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <div className="text-xs text-gray-500 mb-1">היום</div>
          <div className="text-2xl font-bold text-green-600">{stats.today}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <div className="text-xs text-gray-500 mb-1">פגישות שהיו</div>
          <div className="text-2xl font-bold text-gray-600">{stats.past}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <div className="text-xs text-gray-500 mb-1">סה"כ שעות</div>
          <div className="text-2xl font-bold text-purple-600">{stats.totalHours}</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="חפש לפי שם חדר..."
              className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
            />
          </div>

          {/* Filter */}
          <div className="relative">
            <Filter className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm appearance-none"
            >
              <option value="all">כל ההזמנות</option>
              <option value="upcoming">פגישות קרובות</option>
              <option value="today">היום</option>
              <option value="cancellable">ניתנות לביטול</option>
              <option value="past">פגישות שעברו</option>
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm appearance-none"
            >
              <option value="date-desc">תאריך (חדש-ישן)</option>
              <option value="date-asc">תאריך (ישן-חדש)</option>
              <option value="room">שם חדר</option>
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">
            מציג <span className="font-bold text-gray-900">{filteredBookings.length}</span> מתוך {bookings.length} הזמנות
          </span>
          {(searchQuery || filterStatus !== "all" || sortBy !== "date-desc") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setFilterStatus("all");
                setSortBy("date-desc");
              }}
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              נקה הכל
            </button>
          )}
        </div>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="text-gray-900 font-medium mb-1">אין הזמנות</h3>
          <p className="text-gray-500 text-sm">
            {searchQuery || filterStatus !== "all" ? "נסה לשנות את החיפוש או הפילטרים" : "עדיין לא ביצעת הזמנות"}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-100">
            {filteredBookings.map((booking) => {
              const bookingDate = new Date(booking.startTime);
              const bookingEndDate = new Date(booking.endTime);
              const now = new Date();
              const hoursUntilBooking = (bookingDate.getTime() - now.getTime()) / (1000 * 60 * 60);
              const canEdit = hoursUntilBooking > 24;
              const isPast = bookingEndDate < now;
              const isCancellable = hoursUntilBooking > 24;
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
                                  handleEditClick(fullRoom);
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
        </div>
      )}

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

