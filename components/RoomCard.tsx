import { Building2, Users, MapPin, CreditCard, Wifi, Tv, Coffee, SquarePen, Layers } from "lucide-react";

interface RoomCardProps {
  room: {
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
    floor?: string | null;
    space?: {
      name: string;
      address: string;
    };
  };
  onBook?: (room: any) => void;
  showBookButton?: boolean;
}

export default function RoomCard({ room, onBook, showBookButton = true }: RoomCardProps) {
  const imageUrl = room.images 
    ? (room.images.includes(',') ? room.images.split(',')[0] : room.images)
    : null;

  // Parse amenities
  let amenitiesList: string[] = [];
  try {
    if (room.amenities) {
      amenitiesList = typeof room.amenities === 'string' ? JSON.parse(room.amenities) : room.amenities;
    }
  } catch (e) {
    // If parsing fails, treat as empty
  }

  const amenityIcons: Record<string, any> = {
    wifi: Wifi,
    tv: Tv,
    whiteboard: SquarePen,
    coffee: Coffee,
  };

  const amenityLabels: Record<string, string> = {
    wifi: "Wi-Fi",
    tv: "TV",
    whiteboard: "לוח מחיק",
    coffee: "קפה",
  };

  return (
    <div 
      onClick={() => onBook && onBook(room)}
      className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer"
    >
      {/* Room Image */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={room.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.currentTarget.src = "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <Building2 className="w-16 h-16 text-gray-300" />
          </div>
        )}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
          זמין
        </div>
      </div>

      {/* Room Details */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">
          {room.name}
        </h3>

        {/* Room Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="w-4 h-4 text-gray-400" />
            <span>עד {room.capacity} אנשים</span>
          </div>
          {room.floor && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Layers className="w-4 h-4 text-gray-400" />
              <span>{room.floor}</span>
            </div>
          )}
          {room.space && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span>{room.space.name}</span>
            </div>
          )}
          {room.description && (
            <p className="text-xs text-gray-500 mt-2 line-clamp-2">{room.description}</p>
          )}
          {amenitiesList.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {amenitiesList.map((amenity) => {
                const Icon = amenityIcons[amenity];
                if (!Icon) return null;
                return (
                  <div
                    key={amenity}
                    className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-lg text-xs text-gray-600 border border-gray-100"
                  >
                    <Icon className="w-3 h-3" />
                    <span>{amenityLabels[amenity] || amenity}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Pricing */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <div className="text-sm">
            <div className="flex items-center gap-2 text-gray-700 mb-1">
              <CreditCard className="w-4 h-4 text-indigo-500" />
              <span className="font-medium">{room.creditsPerHour}</span>
              <span className="text-gray-500">קרדיטים/שעה</span>
            </div>
            <div className="text-xs text-gray-500">
              או <span className="font-medium">₪{room.pricePerHour}</span>/שעה
            </div>
          </div>
          {showBookButton && (
            <div className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg group-hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-sm">
              הזמן
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

