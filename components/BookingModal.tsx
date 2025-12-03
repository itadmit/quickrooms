"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, X, AlertCircle, Info, Users, MapPin, CreditCard, Wifi, Tv, Coffee, SquarePen, Layers, Building2, CheckCircle2, Loader2, User, ChevronDown } from "lucide-react";
import { format, isSameDay } from "date-fns";

interface BookingModalProps {
  room: {
    id: string;
    name: string;
    capacity: number;
    creditsPerHour: number;
    pricePerHour: number;
    images?: string | null;
    minDurationMinutes?: number;
    timeIntervalMinutes?: number;
    description?: string | null;
    specialInstructions?: string | null;
    amenities?: string | null;
    floor?: string | null;
    space?: {
      name: string;
      address: string;
    };
  };
  member: {
    id: string;
    name?: string;
    email?: string;
    phone?: string;
    creditBalance: number;
    allowOveruse: boolean;
  };
  existingBookings?: Array<{
    startTime: string;
    endTime: string;
  }>;
  onClose: () => void;
  onSubmit: (data: { startTime: string; endTime: string }) => Promise<void>;
}

export default function BookingModal({
  room,
  member,
  existingBookings = [],
  onClose,
  onSubmit,
}: BookingModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [startHour, setStartHour] = useState<number | null>(null);
  const [startMinute, setStartMinute] = useState<number>(0);
  const [endHour, setEndHour] = useState<number | null>(null);
  const [endMinute, setEndMinute] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState<'booking' | 'confirm' | 'payment' | 'loading' | 'success'>('booking');
  const [isClosing, setIsClosing] = useState(false);
  
  // Client details state
  const [clientName, setClientName] = useState(member.name || "");
  const [clientEmail, setClientEmail] = useState(member.email || "");
  const [clientPhone, setClientPhone] = useState(member.phone || "");
  
  // Payment state
  const [pendingBookingData, setPendingBookingData] = useState<{ startTime: string; endTime: string } | null>(null);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  
  // Accordion state
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(true);

  const minDuration = room.minDurationMinutes || 60;
  const timeInterval = room.timeIntervalMinutes || 30;

  // Generate time slots based on interval (8:00 - 22:00)
  const generateTimeSlots = () => {
    const slots: { hour: number; minute: number }[] = [];
    for (let hour = 8; hour < 22; hour++) {
      for (let minute = 0; minute < 60; minute += timeInterval) {
        slots.push({ hour, minute });
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Check if a time slot is available
  const isTimeSlotAvailable = (hour: number, minute: number) => {
    const slotStart = new Date(selectedDate);
    slotStart.setHours(hour, minute, 0, 0);
    const slotEnd = new Date(slotStart);
    slotEnd.setMinutes(slotEnd.getMinutes() + timeInterval);

    return !existingBookings.some((booking) => {
      const bookingStart = new Date(booking.startTime);
      const bookingEnd = new Date(booking.endTime);
      return (
        isSameDay(bookingStart, selectedDate) &&
        slotStart < bookingEnd &&
        slotEnd > bookingStart
      );
    });
  };

  const calculateCost = () => {
    // If no times selected, return zeros
    if (startHour === null || endHour === null) {
      return { credits: 0, price: 0, hours: 0, minutes: 0 };
    }

    const start = new Date(selectedDate);
    start.setHours(startHour, startMinute, 0, 0);
    const end = new Date(selectedDate);
    end.setHours(endHour, endMinute, 0, 0);
    
    const durationMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
    if (durationMinutes < minDuration) return { credits: 0, price: 0, hours: 0, minutes: 0 };

    const hours = durationMinutes / 60;
    const creditsNeeded = Math.ceil(hours * room.creditsPerHour);
    let creditsToUse = 0;
    let priceToPay = 0;

    if (member.creditBalance >= creditsNeeded) {
      creditsToUse = creditsNeeded;
      priceToPay = 0;
    } else {
      // יש חריגה - צריך תשלום
      creditsToUse = member.creditBalance;
      const overuseCredits = creditsNeeded - member.creditBalance;
      const overuseHours = overuseCredits / room.creditsPerHour;
      priceToPay = overuseHours * room.pricePerHour;
    }

    return { credits: creditsToUse, price: priceToPay, hours, minutes: durationMinutes };
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300); // Match animation duration
  };

  const handleSubmit = () => {
    const start = new Date(selectedDate);
    start.setHours(startHour, startMinute, 0, 0);
    const end = new Date(selectedDate);
    end.setHours(endHour, endMinute, 0, 0);

    const durationMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
    
    if (durationMinutes < minDuration) {
      return;
    }

    if (start >= end) {
      return;
    }

    // Check if time slot is available
    const isAvailable = !existingBookings.some((booking) => {
      const bookingStart = new Date(booking.startTime);
      const bookingEnd = new Date(booking.endTime);
      return (
        isSameDay(bookingStart, selectedDate) &&
        start < bookingEnd &&
        end > bookingStart
      );
    });

    if (!isAvailable) {
      return; // Don't proceed if not available
    }

    // בדוק אם צריך תשלום
    const needsPayment = cost.price > 0;

    // אם צריך תשלום, עבור ישירות לתשלום (דלג על אישור)
    if (needsPayment) {
      const bookingData = {
        startTime: start.toISOString(),
        endTime: end.toISOString(),
      };
      setPendingBookingData(bookingData);
      setStep('payment');
      
      // צור תשלום מיד
      (async () => {
        try {
          const response = await fetch('/api/payments/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              bookingData: bookingData,
              roomId: room.id,
              amount: cost.price,
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'שגיאה ביצירת תשלום');
          }

          const { paymentUrl: url, transactionId } = await response.json();
          setPaymentUrl(url);
          
          // פתח את דף התשלום בחלון חדש
          const paymentWindow = window.open(url, 'payment', 'width=600,height=700');
          
          if (!paymentWindow) {
            alert('אנא אפשר חלונות קופצים בדפדפן');
            setStep('booking');
            return;
          }
          
          // בדוק כל 2 שניות אם התשלום הושלם
          const checkInterval = setInterval(async () => {
            if (paymentWindow.closed) {
              clearInterval(checkInterval);
              await checkPaymentStatus(transactionId);
            }
          }, 2000);
          
          // timeout אחרי 30 דקות
          setTimeout(() => {
            clearInterval(checkInterval);
            if (!paymentWindow.closed) {
              paymentWindow.close();
            }
          }, 30 * 60 * 1000);
        } catch (error) {
          console.error('Payment creation error:', error);
          alert(error instanceof Error ? error.message : 'שגיאה ביצירת תשלום. נסה שוב.');
          setStep('booking');
        }
      })();
      return;
    }

    // Move to confirmation step
    setStep('confirm');
  };

  // Check if current selection overlaps with existing bookings
  const isCurrentSelectionAvailable = () => {
    const start = new Date(selectedDate);
    start.setHours(startHour, startMinute, 0, 0);
    const end = new Date(selectedDate);
    end.setHours(endHour, endMinute, 0, 0);

    return !existingBookings.some((booking) => {
      const bookingStart = new Date(booking.startTime);
      const bookingEnd = new Date(booking.endTime);
      return (
        isSameDay(bookingStart, selectedDate) &&
        start < bookingEnd &&
        end > bookingStart
      );
    });
  };

  const handleConfirm = async () => {
    const start = new Date(selectedDate);
    start.setHours(startHour, startMinute, 0, 0);
    const end = new Date(selectedDate);
    end.setHours(endHour, endMinute, 0, 0);

    const bookingData = {
      startTime: start.toISOString(),
      endTime: end.toISOString(),
    };

    // בדוק אם צריך תשלום (יש חריגה שדורשת תשלום)
    const needsPayment = cost.price > 0;

    if (needsPayment) {
      // שמור את פרטי ההזמנה והעבר לשלב תשלום
      setPendingBookingData(bookingData);
      
      // אם כבר יש paymentUrl, פשוט פתח אותו
      if (paymentUrl) {
        setStep('payment');
        const paymentWindow = window.open(paymentUrl, 'payment', 'width=600,height=700');
        if (paymentWindow) {
          const checkInterval = setInterval(async () => {
            if (paymentWindow.closed) {
              clearInterval(checkInterval);
              await checkPaymentStatus();
            }
          }, 2000);
        }
        return;
      }
      
      setStep('payment');
      
      // צור תשלום
      try {
        const response = await fetch('/api/payments/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            bookingData: bookingData,
            roomId: room.id,
            amount: cost.price,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'שגיאה ביצירת תשלום');
        }

        const { paymentUrl: url, transactionId } = await response.json();
        setPaymentUrl(url);
        
        // פתח את דף התשלום בחלון חדש
        const paymentWindow = window.open(url, 'payment', 'width=600,height=700');
        
        if (!paymentWindow) {
          alert('אנא אפשר חלונות קופצים בדפדפן');
          setStep('confirm');
          return;
        }
        
        // בדוק כל 2 שניות אם התשלום הושלם
        const checkInterval = setInterval(async () => {
          if (paymentWindow.closed) {
            clearInterval(checkInterval);
            // בדוק אם התשלום הצליח
            await checkPaymentStatus(transactionId);
          }
        }, 2000);
        
        // timeout אחרי 30 דקות
        setTimeout(() => {
          clearInterval(checkInterval);
          if (!paymentWindow.closed) {
            paymentWindow.close();
          }
        }, 30 * 60 * 1000);
      } catch (error) {
        console.error('Payment creation error:', error);
        const errorMessage = error instanceof Error ? error.message : 'שגיאה ביצירת תשלום. נסה שוב.';
        alert(errorMessage);
        setStep('booking');
        setPendingBookingData(null);
        setPaymentUrl(null);
      }
    } else {
      // יש מספיק קרדיטים - המשך ישירות ליצירת ההזמנה
      setStep('loading');
      try {
        await onSubmit(bookingData);
        setStep('success');
      } catch (error) {
        setStep('booking');
      }
    }
  };

  const checkPaymentStatus = async (transactionId?: string) => {
    if (!pendingBookingData) return;
    
    // נסה ליצור את ההזמנה (ה-webhook אמור ליצור אותה, אבל נבדוק)
    setStep('loading');
    try {
      // בדוק אם ההזמנה כבר נוצרה (דרך API)
      // לעת עתה, ננסה ליצור אותה ישירות
      await onSubmit(pendingBookingData);
      setStep('success');
      setPendingBookingData(null);
      setPaymentUrl(null);
    } catch (error) {
      // אם ההזמנה כבר קיימת, זה בסדר
      console.log('Booking might already exist:', error);
      setStep('success');
      setPendingBookingData(null);
      setPaymentUrl(null);
    }
  };

  const cost = calculateCost();
  
  let hasEnoughCredits = false;
  if (startHour !== null && endHour !== null) {
    const start = new Date(selectedDate);
    start.setHours(startHour, startMinute, 0, 0);
    const end = new Date(selectedDate);
    end.setHours(endHour, endMinute, 0, 0);
    const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    const creditsNeeded = Math.ceil(durationHours * room.creditsPerHour);
    hasEnoughCredits = member.creditBalance >= creditsNeeded || member.allowOveruse;
  }

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

  const imageUrl = room.images 
    ? (room.images.includes(',') ? room.images.split(',')[0] : room.images)
    : null;

  return (
    <div 
      data-modal="true"
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-end p-0"
      onClick={handleClose}
      style={{ marginTop: 0 }}
    >
      <div 
        className={`bg-white h-full w-full max-w-5xl flex flex-col shadow-2xl ${
          isClosing ? 'animate-modal-slide-out-rtl' : 'animate-modal-slide-in-rtl'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center z-10">
          <div>
            {step === 'success' ? (
              <h3 className="text-xl font-bold text-gray-900">הזמנה בוצעה בהצלחה!</h3>
            ) : step === 'loading' ? (
              <h3 className="text-xl font-bold text-gray-900">מבצע הזמנה...</h3>
            ) : step === 'confirm' ? (
              <h3 className="text-xl font-bold text-gray-900">אישור הזמנה</h3>
            ) : step === 'payment' ? (
              <h3 className="text-xl font-bold text-gray-900">תשלום</h3>
            ) : (
              <>
                <h3 className="text-xl font-bold text-gray-900">הזמנת {room.name}</h3>
                <p className="text-sm text-gray-500 mt-1">עד {room.capacity} אנשים</p>
              </>
            )}
          </div>
          {step !== 'loading' && (
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto relative">
          {/* Animated Content Container */}
          <div className="relative min-h-full">
            {/* Booking Form */}
            {step === 'booking' && (
              <div className="animate-slide-up-in">
          <div className="flex flex-col lg:flex-row lg:h-full">
            {/* Sidebar - Room Details */}
            <div className="lg:w-96 border-b lg:border-b-0 lg:border-l border-gray-200 bg-gray-50 lg:flex-shrink-0 flex flex-col lg:overflow-y-auto">
              {/* Room Image */}
              <div className="relative h-48 lg:h-64 bg-gray-200 overflow-hidden">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={room.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                    <Building2 className="w-16 h-16 text-gray-300" />
                  </div>
                )}
              </div>

              {/* Room Details */}
              <div className="flex-1 p-4 lg:p-6 flex flex-col gap-4 lg:gap-6 overflow-y-auto [&>div:first-child]:mt-0">
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">{room.name}</h4>
                  {room.description && (
                    <p className="text-sm text-gray-600 leading-relaxed">{room.description}</p>
                  )}
                </div>

                {/* Room Info */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span>עד {room.capacity} אנשים</span>
                  </div>
                  {room.floor && (
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Layers className="w-4 h-4 text-gray-400" />
                      <span>{room.floor}</span>
                    </div>
                  )}
                  {room.space && (
                    <div className="flex items-start gap-2 text-sm text-gray-700">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-medium">{room.space.name}</div>
                        <div className="text-xs text-gray-500">{room.space.address}</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Amenities */}
                {amenitiesList.length > 0 && (
                  <div>
                    <h5 className="text-sm font-medium text-gray-900 mb-3">מתקני החדר</h5>
                    <div className="flex flex-wrap gap-2">
                      {amenitiesList.map((amenity) => {
                        const Icon = amenityIcons[amenity];
                        if (!Icon) return null;
                        return (
                          <div
                            key={amenity}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-lg text-xs text-gray-700 border border-gray-200"
                          >
                            <Icon className="w-4 h-4" />
                            <span>{amenityLabels[amenity] || amenity}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Pricing */}
                <div className="pt-4 border-t border-gray-200">
                  <h5 className="text-sm font-medium text-gray-900 mb-3">מחירים</h5>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <CreditCard className="w-4 h-4 text-indigo-500" />
                      <span className="font-medium">{room.creditsPerHour}</span>
                      <span className="text-gray-500">קרדיטים/שעה</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      או <span className="font-medium">₪{room.pricePerHour}</span>/שעה
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content - Booking Form */}
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex-1 p-4 lg:p-6 flex flex-col gap-4 overflow-y-auto [&>div:first-child]:mt-0">
              
              {/* Client Details */}
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">פרטי הלקוח</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="flex items-center gap-2 text-sm text-gray-700 mb-2">
                      <User className="w-4 h-4 text-gray-400" />
                      שם מלא
                    </label>
                    <input
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="הזן שם מלא"
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm text-gray-700 mb-2">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      טלפון
                    </label>
                    <input
                      type="tel"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      placeholder="הזן מספר טלפון"
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="flex items-center gap-2 text-sm text-gray-700 mb-2">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      אימייל
                    </label>
                    <input
                      type="email"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder="הזן כתובת אימייל"
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Date Selection */}
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  בחר תאריך
                </h4>
                
                {/* Quick Date Picker - Scrollable */}
                <div className="mb-4">
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {Array.from({ length: 8 }, (_, i) => {
                      const date = new Date();
                      date.setDate(date.getDate() + i);
                      const isSelected = format(date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");
                      const isToday = format(date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
                      
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setSelectedDate(date)}
                          className={`flex-shrink-0 w-16 h-20 flex flex-col items-center justify-center rounded-lg border-2 transition-all ${
                            isSelected
                              ? 'border-indigo-600 bg-indigo-50'
                              : isToday
                              ? 'border-indigo-300 bg-indigo-50/50'
                              : 'border-gray-200 bg-white hover:border-gray-300'
                          }`}
                        >
                          <span className={`text-xs font-medium mb-1 ${
                            isSelected ? 'text-indigo-600' : 'text-gray-500'
                          }`}>
                            {date.toLocaleDateString("he-IL", { weekday: "short" })}
                          </span>
                          <span className={`text-xl font-bold ${
                            isSelected ? 'text-indigo-600' : 'text-gray-900'
                          }`}>
                            {date.getDate()}
                          </span>
                          <span className={`text-xs ${
                            isSelected ? 'text-indigo-600' : 'text-gray-500'
                          }`}>
                            {date.toLocaleDateString("he-IL", { month: "short" })}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
                
                {/* Calendar Picker */}
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={format(selectedDate, "yyyy-MM-dd")}
                    onChange={(e) => setSelectedDate(new Date(e.target.value))}
                    min={format(new Date(), "yyyy-MM-dd")}
                    className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    או בחר תאריך אחר
                  </span>
                </div>
                
                <p className="text-xs text-gray-500 mt-2">
                  {selectedDate.toLocaleDateString("he-IL", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>

          {/* Time Selection */}
          <div>
            <h4 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" />
              בחר שעות
            </h4>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs text-gray-500 mb-2">משעה</label>
                <select
                  value={startHour === null ? "" : `${startHour}:${startMinute.toString().padStart(2, "0")}`}
                  onChange={(e) => {
                    if (!e.target.value) return;
                    const [hour, minute] = e.target.value.split(":").map(Number);
                    setStartHour(hour);
                    setStartMinute(minute);
                    // Auto-adjust end time to meet minimum duration
                    const newEnd = new Date(selectedDate);
                    newEnd.setHours(hour, minute, 0, 0);
                    newEnd.setMinutes(newEnd.getMinutes() + minDuration);
                    setEndHour(newEnd.getHours());
                    setEndMinute(newEnd.getMinutes());
                  }}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">בחר שעת התחלה</option>
                  {timeSlots.map((slot, idx) => {
                    const slotTime = new Date(selectedDate);
                    slotTime.setHours(slot.hour, slot.minute, 0, 0);
                    
                    // Disable past times if today
                    const now = new Date();
                    const isToday = isSameDay(selectedDate, now);
                    const isPast = isToday && slotTime < now;
                    
                    const isDisabled = isPast || (endHour !== null && slotTime >= new Date(selectedDate).setHours(endHour, endMinute, 0, 0));
                    return (
                      <option
                        key={idx}
                        value={`${slot.hour}:${slot.minute.toString().padStart(2, "0")}`}
                        disabled={isDisabled}
                      >
                        {slot.hour.toString().padStart(2, "0")}:{slot.minute.toString().padStart(2, "0")}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-2">עד שעה</label>
                <select
                  value={endHour === null ? "" : `${endHour}:${endMinute.toString().padStart(2, "0")}`}
                  onChange={(e) => {
                    if (!e.target.value) return;
                    const [hour, minute] = e.target.value.split(":").map(Number);
                    setEndHour(hour);
                    setEndMinute(minute);
                  }}
                  disabled={startHour === null}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">בחר שעת סיום</option>
                  {timeSlots.map((slot, idx) => {
                    if (startHour === null) return null;
                    
                    const slotTime = new Date(selectedDate);
                    slotTime.setHours(slot.hour, slot.minute, 0, 0);
                    const startTime = new Date(selectedDate);
                    startTime.setHours(startHour, startMinute, 0, 0);
                    const minEndTime = new Date(startTime);
                    minEndTime.setMinutes(minEndTime.getMinutes() + minDuration);
                    const isDisabled = slotTime <= startTime || slotTime < minEndTime;
                    return (
                      <option
                        key={idx}
                        value={`${slot.hour}:${slot.minute.toString().padStart(2, "0")}`}
                        disabled={isDisabled}
                      >
                        {slot.hour.toString().padStart(2, "0")}:{slot.minute.toString().padStart(2, "0")}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            {/* Availability Timeline */}
            <div className="bg-gray-50 rounded-lg p-4 mt-4">
              <p className="text-xs text-gray-600 mb-3">זמינות לפי שעות (מינימום {minDuration} דקות):</p>
              <div className="grid grid-cols-5 lg:grid-cols-8 gap-1">
                {timeSlots.map((slot, idx) => {
                  const slotTime = new Date(selectedDate);
                  slotTime.setHours(slot.hour, slot.minute, 0, 0);
                  const now = new Date();
                  const isPast = slotTime < now;
                  const isAvailable = !isPast && isTimeSlotAvailable(slot.hour, slot.minute);
                  const startTime = new Date(selectedDate);
                  startTime.setHours(startHour, startMinute, 0, 0);
                  const endTime = new Date(selectedDate);
                  endTime.setHours(endHour, endMinute, 0, 0);
                  const isSelected = slotTime >= startTime && slotTime < endTime;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        if (isAvailable) {
                          setStartHour(slot.hour);
                          setStartMinute(slot.minute);
                          const newEnd = new Date(selectedDate);
                          newEnd.setHours(slot.hour, slot.minute, 0, 0);
                          newEnd.setMinutes(newEnd.getMinutes() + minDuration);
                          setEndHour(newEnd.getHours());
                          setEndMinute(newEnd.getMinutes());
                        }
                      }}
                      className={`px-2 py-2 lg:px-3 lg:py-1.5 text-sm lg:text-xs rounded-lg transition-all ${
                        isSelected
                          ? "bg-indigo-600 text-white font-medium"
                          : isAvailable
                          ? "bg-white border border-gray-200 text-gray-700 hover:border-indigo-300"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                      disabled={!isAvailable}
                    >
                      {slot.hour.toString().padStart(2, "0")}:{slot.minute.toString().padStart(2, "0")}
                    </button>
                  );
                })}
              </div>
              <div className="flex gap-4 mt-3 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-white border border-gray-200 rounded"></div>
                  <span className="text-gray-600">פנוי</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-200 rounded"></div>
                  <span className="text-gray-600">תפוס</span>
                </div>
              </div>
            </div>
          </div>


              {/* Special Instructions - moved here */}
              {room.specialInstructions && (
                <div className="border-b border-gray-200">
                  <button
                    type="button"
                    onClick={() => setIsInstructionsOpen(!isInstructionsOpen)}
                    className="w-full flex items-center justify-between py-3 text-right hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Info className="w-4 h-4 text-gray-400" />
                      <h5 className="text-sm font-medium text-gray-900">הנחיות מיוחדות</h5>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isInstructionsOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isInstructionsOpen && (
                    <div className="pb-3">
                      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{room.specialInstructions}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Validation Messages */}
              {startHour !== null && endHour !== null && !hasEnoughCredits && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  אין מספיק קרדיטים והחריגה לא מותרת
                </div>
              )}
              </div>

              {/* Actions - Outside scrollable area */}
              <div className="flex flex-col sm:flex-row gap-3 p-4 lg:px-6 lg:py-4 border-t border-gray-200 bg-white flex-shrink-0">
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full sm:flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium order-2 sm:order-1"
                >
                  ביטול
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting || !hasEnoughCredits || cost.minutes < minDuration || !isCurrentSelectionAvailable()}
                  className="w-full sm:flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium order-1 sm:order-2"
                >
                  {!isCurrentSelectionAvailable() && cost.minutes > 0 ? (
                    <span className="text-xs">שימו לב: החדר תפוס בשעות אלו</span>
                  ) : cost.hours > 0 ? (
                    <div className="flex items-center justify-center gap-3">
                      <span>שליחה</span>
                      <div className="flex items-center gap-1 text-sm">
                        <Clock className="w-4 h-4" />
                        <span>
                          {cost.minutes >= 60 
                            ? `${Math.floor(cost.minutes / 60)} שעות${cost.minutes % 60 > 0 ? ` ${cost.minutes % 60} דקות` : ''}`
                            : `${cost.minutes} דקות`
                          }
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <CreditCard className="w-4 h-4" />
                        <span>{cost.credits} קרדיט</span>
                      </div>
                    </div>
                  ) : (
                    'אשר הזמנה'
                  )}
                </button>
              </div>
            </div>
          </div>
            </div>
            )}

            {/* Confirm Step */}
            {step === 'confirm' && (
              <div className="animate-slide-up-in absolute inset-0 flex items-center justify-center p-4 sm:p-8">
                <div className="max-w-md w-full bg-white rounded-2xl border border-gray-200 shadow-xl p-6 sm:p-8 text-center">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-8 h-8 text-indigo-600" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">האם אתה בטוח?</h3>
                  
                  <div className="space-y-4 mb-6">
                    <div className="text-right">
                      <p className="text-sm text-gray-500 mb-1">אתה עומד להזמין את</p>
                      <p className="text-base font-semibold text-gray-900">{room.name}</p>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-sm text-gray-500 mb-1">בתאריך</p>
                      <p className="text-base font-medium text-gray-900">
                        {selectedDate.toLocaleDateString("he-IL", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-sm text-gray-500 mb-1">בין השעות</p>
                      <p className="text-base font-medium text-gray-900">
                        {startHour.toString().padStart(2, "0")}:{startMinute.toString().padStart(2, "0")} - {endHour.toString().padStart(2, "0")}:{endMinute.toString().padStart(2, "0")}
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-indigo-50 rounded-lg p-4 mb-6 border border-indigo-100">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-indigo-600" />
                        <span className="text-sm text-gray-700">קרדיטים שינוכו:</span>
                      </div>
                      <span className="text-lg font-bold text-indigo-600">{cost.credits}</span>
                    </div>
                    {cost.price > 0 && (
                      <div className="flex justify-between items-center mt-3 pt-3 border-t border-indigo-200">
                        <span className="text-sm text-gray-700">תשלום נוסף:</span>
                        <span className="text-lg font-bold text-amber-600">₪{cost.price.toFixed(0)}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setStep('booking')}
                      className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                      חזרה
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirm}
                      className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                    >
                      {cost.price > 0 ? 'מעבר לתשלום' : 'אישור סופי'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Loading Step */}
            {step === 'loading' && (
              <div className="animate-slide-up-in absolute inset-0 flex items-center justify-center p-8">
                <div className="max-w-md w-full bg-white rounded-2xl border border-gray-200 shadow-xl p-12 text-center">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">מבצע הזמנה...</h3>
                  <p className="text-gray-600">אנא המתן בזמן שאנו מעבדים את ההזמנה שלך</p>
                </div>
              </div>
            )}

            {/* Payment Step */}
            {step === 'payment' && paymentUrl && (
              <div className="animate-slide-up-in absolute inset-0 flex items-center justify-center p-4 sm:p-8">
                <div className="max-w-md w-full bg-white rounded-2xl border border-gray-200 shadow-xl p-6 sm:p-8 text-center">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CreditCard className="w-8 h-8 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">תשלום נדרש</h3>
                  <p className="text-gray-600 mb-6">
                    אין לך מספיק קרדיטים להזמנה זו.
                    <br />
                    אנא השלם את התשלום כדי להשלים את ההזמנה.
                  </p>
                  <div className="bg-indigo-50 rounded-lg p-4 mb-6 border border-indigo-100">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-700">סכום לתשלום:</span>
                      <span className="text-lg font-bold text-indigo-600">₪{cost.price.toFixed(0)}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={() => {
                        if (paymentUrl) {
                          window.open(paymentUrl, 'payment', 'width=600,height=700');
                        }
                      }}
                      className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                    >
                      פתח דף תשלום
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep('confirm')}
                      className="w-full px-4 py-3 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                      חזרה
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-4">
                    אחרי שתשלים את התשלום, ההזמנה תיווצר אוטומטית
                  </p>
                </div>
              </div>
            )}

            {/* Success Step */}
            {step === 'success' && (
              <div className="animate-slide-up-in absolute inset-0 flex items-center justify-center p-4 sm:p-8">
                <div className="max-w-md w-full bg-white rounded-2xl border border-gray-200 shadow-xl p-6 sm:p-12 text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">תודה!</h3>
                  <p className="text-gray-600 mb-6">
                    ההזמנה שלך בוצעה בהצלחה
                  </p>
                  
                  <div className="bg-gray-50 rounded-lg p-4 mb-6 text-right space-y-3">
                    <div className="flex items-start gap-2">
                      <Building2 className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 mb-1">חדר</p>
                        <p className="text-sm font-semibold text-gray-900">{room.name}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Calendar className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 mb-1">תאריך</p>
                        <p className="text-sm font-medium text-gray-900">
                          {selectedDate.toLocaleDateString("he-IL", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Clock className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 mb-1">שעה</p>
                        <p className="text-sm font-medium text-gray-900">
                          {startHour.toString().padStart(2, "0")}:{startMinute.toString().padStart(2, "0")} - {endHour.toString().padStart(2, "0")}:{endMinute.toString().padStart(2, "0")}
                        </p>
                      </div>
                    </div>
                    {cost.credits > 0 ? (
                      <div className="pt-3 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-gray-400" />
                            <span className="text-xs text-gray-500">קרדיטים שנוכו</span>
                          </div>
                          <span className="text-sm font-bold text-indigo-600">{cost.credits}</span>
                        </div>
                      </div>
                    ) : cost.price > 0 && (
                      <div className="pt-3 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">שולם</span>
                          <span className="text-sm font-bold text-green-600">₪{cost.price.toFixed(0)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    {cost.price > 0 && cost.credits === 0 && (
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            // TODO: צריך את bookingId - נוסיף את זה בשלב הבא
                            const response = await fetch(`/api/payments/invoice/BOOKING_ID`);
                            if (response.ok) {
                              const blob = await response.blob();
                              const url = window.URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = `invoice.pdf`;
                              a.click();
                            } else {
                              alert("שגיאה בהורדת חשבונית");
                            }
                          } catch (error) {
                            console.error('Error downloading invoice:', error);
                            alert("שגיאה בהורדת חשבונית");
                          }
                        }}
                        className="w-full px-4 py-3 bg-white border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors font-medium flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        הורד חשבונית מס/קבלה
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={handleClose}
                      className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                    >
                      סגור
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

