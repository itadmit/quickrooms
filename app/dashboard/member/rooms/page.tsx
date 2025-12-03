"use client";

import { useEffect, useState } from "react";
import { Building2, Search, Filter, MapPin, Users, Star } from "lucide-react";
import RoomCard from "@/components/RoomCard";
import BookingModal from "@/components/BookingModal";

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

interface MemberData {
  id: string;
  name: string;
  email: string;
  username: string;
  creditBalance: number;
  allowOveruse: boolean;
  ownerId: string;
}

export default function AvailableRoomsPage() {
  const [member, setMember] = useState<MemberData | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCapacity, setSelectedCapacity] = useState<string>("all");
  const [selectedFloor, setSelectedFloor] = useState<string>("all");
  const [selectedSpace, setSelectedSpace] = useState<string>("all");
  const [maxCredits, setMaxCredits] = useState<number>(100);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("name");

  // Available options for filters
  const [availableFloors, setAvailableFloors] = useState<string[]>([]);
  const [availableSpaces, setAvailableSpaces] = useState<string[]>([]);
  const [availableAmenities, setAvailableAmenities] = useState<string[]>([]);

  useEffect(() => {
    fetchMemberData();
    fetchBookings();
  }, []);

  useEffect(() => {
    if (rooms.length > 0) {
      extractFilterOptions();
      applyFilters();
    }
  }, [rooms, searchQuery, selectedCapacity, selectedFloor, selectedSpace, maxCredits, selectedAmenities, sortBy]);

  const fetchMemberData = async () => {
    try {
      const response = await fetch("/api/auth/me");
      if (response.ok) {
        const data = await response.json();
        setMember(data.user);
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
        setFilteredRooms(allRooms);
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  const extractFilterOptions = () => {
    const floors = new Set<string>();
    const spaces = new Set<string>();
    const amenities = new Set<string>();

    rooms.forEach(room => {
      if (room.floor) floors.add(room.floor);
      if (room.space.name) spaces.add(room.space.name);
      if (room.amenities) {
        try {
          const roomAmenities = JSON.parse(room.amenities);
          roomAmenities.forEach((a: string) => amenities.add(a));
        } catch (e) {}
      }
    });

    setAvailableFloors(Array.from(floors).sort());
    setAvailableSpaces(Array.from(spaces).sort());
    setAvailableAmenities(Array.from(amenities).sort());
  };

  const applyFilters = () => {
    let filtered = [...rooms];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(room => 
        room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.space.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Capacity filter
    if (selectedCapacity !== "all") {
      const capacity = parseInt(selectedCapacity);
      filtered = filtered.filter(room => room.capacity >= capacity);
    }

    // Floor filter
    if (selectedFloor !== "all") {
      filtered = filtered.filter(room => room.floor === selectedFloor);
    }

    // Space filter
    if (selectedSpace !== "all") {
      filtered = filtered.filter(room => room.space.name === selectedSpace);
    }

    // Credits filter
    filtered = filtered.filter(room => room.creditsPerHour <= maxCredits);

    // Amenities filter
    if (selectedAmenities.length > 0) {
      filtered = filtered.filter(room => {
        if (!room.amenities) return false;
        try {
          const roomAmenities = JSON.parse(room.amenities);
          return selectedAmenities.every(amenity => roomAmenities.includes(amenity));
        } catch (e) {
          return false;
        }
      });
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name, 'he');
        case "capacity":
          return b.capacity - a.capacity;
        case "credits-low":
          return a.creditsPerHour - b.creditsPerHour;
        case "credits-high":
          return b.creditsPerHour - a.creditsPerHour;
        default:
          return 0;
      }
    });

    setFilteredRooms(filtered);
  };

  const handleBookingClick = (room: Room) => {
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

  const getRoomBookings = () => {
    if (!selectedRoom) return [];
    return bookings
      .filter((b: any) => b.room.id === selectedRoom.id)
      .map((b: any) => ({
        startTime: b.startTime,
        endTime: b.endTime,
      }));
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) 
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCapacity("all");
    setSelectedFloor("all");
    setSelectedSpace("all");
    setMaxCredits(100);
    setSelectedAmenities([]);
    setSortBy("name");
  };

  const amenityLabels: { [key: string]: string } = {
    wifi: "Wi-Fi",
    tv: "מסך",
    whiteboard: "לוח",
    coffee: "קפה",
    projector: "מקרן",
    phone: "טלפון",
    ac: "מיזוג",
    kitchen: "מטבחון"
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
        <h1 className="text-2xl font-bold text-gray-900">חדרים זמינים</h1>
        <p className="text-gray-500 text-sm mt-1">חפש ומצא את חדר הישיבות המושלם</p>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="relative">
          <Search className="w-5 h-5 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="חפש לפי שם חדר, מתחם או תיאור..."
            className="w-full pr-12 pl-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-gray-900">סינון</h3>
              </div>
              <button
                onClick={clearFilters}
                className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
              >
                נקה הכל
              </button>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">מיון</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value="name">שם (א-ת)</option>
                <option value="capacity">קיבולת (גבוה-נמוך)</option>
                <option value="credits-low">קרדיטים (נמוך-גבוה)</option>
                <option value="credits-high">קרדיטים (גבוה-נמוך)</option>
              </select>
            </div>

            {/* Capacity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  קיבולת מינימלית
                </div>
              </label>
              <select
                value={selectedCapacity}
                onChange={(e) => setSelectedCapacity(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value="all">הכל</option>
                <option value="2">2+ אנשים</option>
                <option value="4">4+ אנשים</option>
                <option value="6">6+ אנשים</option>
                <option value="8">8+ אנשים</option>
                <option value="10">10+ אנשים</option>
              </select>
            </div>

            {/* Space */}
            {availableSpaces.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    מתחם
                  </div>
                </label>
                <select
                  value={selectedSpace}
                  onChange={(e) => setSelectedSpace(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                >
                  <option value="all">כל המתחמים</option>
                  {availableSpaces.map(space => (
                    <option key={space} value={space}>{space}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Floor */}
            {availableFloors.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    קומה
                  </div>
                </label>
                <select
                  value={selectedFloor}
                  onChange={(e) => setSelectedFloor(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                >
                  <option value="all">כל הקומות</option>
                  {availableFloors.map(floor => (
                    <option key={floor} value={floor}>{floor}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Max Credits */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center justify-between">
                  <span>קרדיטים מקסימליים לשעה</span>
                  <span className="text-indigo-600 font-bold">{maxCredits}</span>
                </div>
              </label>
              <input
                type="range"
                min="1"
                max="100"
                value={maxCredits}
                onChange={(e) => setMaxCredits(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1</span>
                <span>100</span>
              </div>
            </div>

            {/* Amenities */}
            {availableAmenities.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    שירותים
                  </div>
                </label>
                <div className="space-y-2">
                  {availableAmenities.map(amenity => (
                    <label key={amenity} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedAmenities.includes(amenity)}
                        onChange={() => toggleAmenity(amenity)}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-700">{amenityLabels[amenity] || amenity}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Rooms Grid */}
        <div className="lg:col-span-3">
          {/* Results Count */}
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              נמצאו <span className="font-bold text-gray-900">{filteredRooms.length}</span> חדרים
            </p>
          </div>

          {filteredRooms.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-gray-300" />
              </div>
              <h3 className="text-gray-900 font-medium mb-1">לא נמצאו חדרים</h3>
              <p className="text-gray-500 text-sm">נסה לשנות את הפילטרים</p>
              <button
                onClick={clearFilters}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
              >
                נקה פילטרים
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredRooms.map((room) => (
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
    </div>
  );
}

