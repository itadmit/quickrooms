import { prisma } from './prisma';
import { addDays, addWeeks, addMonths, isSameDay, getDay } from 'date-fns';

export interface RecurringPattern {
  type: 'daily' | 'weekly' | 'monthly';
  days?: number[]; // For weekly: [0,2,4] = Sunday, Tuesday, Thursday
  endDate?: Date;
  occurrences?: number; // Max number of occurrences
}

export async function createRecurringBookings(
  baseBooking: {
    roomId: string;
    ownerId: string;
    memberId?: string;
    guestEmail?: string;
    guestName?: string;
    startTime: Date;
    endTime: Date;
    hours: number;
    creditsUsed?: number;
    priceCharged?: number;
  },
  pattern: RecurringPattern
) {
  const bookings = [];
  let currentDate = new Date(baseBooking.startTime);
  let currentEndDate = new Date(baseBooking.endTime);
  let occurrenceCount = 0;
  const maxOccurrences = pattern.occurrences || 100; // Default limit

  while (occurrenceCount < maxOccurrences) {
    // Check if we've passed the end date
    if (pattern.endDate && currentDate > pattern.endDate) {
      break;
    }

    // Check day of week for weekly pattern
    if (pattern.type === 'weekly' && pattern.days) {
      const dayOfWeek = getDay(currentDate);
      if (!pattern.days.includes(dayOfWeek)) {
        // Move to next day
        currentDate = addDays(currentDate, 1);
        currentEndDate = addDays(currentEndDate, 1);
        continue;
      }
    }

    // Create booking instance
    const booking = await prisma.booking.create({
      data: {
        ...baseBooking,
        startTime: currentDate,
        endTime: currentEndDate,
        isRecurring: true,
        recurringBookingId: baseBooking.roomId, // Will be updated after first booking
        recurringPattern: JSON.stringify(pattern),
      },
    });

    // Update recurringBookingId for first booking
    if (occurrenceCount === 0) {
      await prisma.booking.update({
        where: { id: booking.id },
        data: { recurringBookingId: booking.id },
      });
    } else {
      await prisma.booking.update({
        where: { id: booking.id },
        data: { recurringBookingId: bookings[0].id },
      });
    }

    bookings.push(booking);
    occurrenceCount++;

    // Move to next occurrence
    if (pattern.type === 'daily') {
      currentDate = addDays(currentDate, 1);
      currentEndDate = addDays(currentEndDate, 1);
    } else if (pattern.type === 'weekly') {
      currentDate = addWeeks(currentDate, 1);
      currentEndDate = addWeeks(currentEndDate, 1);
    } else if (pattern.type === 'monthly') {
      currentDate = addMonths(currentDate, 1);
      currentEndDate = addMonths(currentEndDate, 1);
    }
  }

  return bookings;
}

export async function cancelRecurringBooking(recurringBookingId: string) {
  // Cancel all instances of recurring booking
  await prisma.booking.updateMany({
    where: {
      OR: [
        { id: recurringBookingId },
        { recurringBookingId },
      ],
    },
    data: {
      // Mark as cancelled - you might want to add a status field
      // For now, we'll delete future bookings
    },
  });
}

