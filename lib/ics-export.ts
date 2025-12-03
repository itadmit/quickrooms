// iCal/ICS Export for Google Calendar integration

export function generateICS(booking: {
  id: string;
  startTime: Date;
  endTime: Date;
  room: { name: string };
  member?: { name: string } | null;
  guestName?: string | null;
}) {
  const start = formatDate(booking.startTime);
  const end = formatDate(booking.endTime);
  const now = formatDate(new Date());
  const summary = `הזמנת חדר: ${booking.room.name}`;
  const description = `הזמנת חדר ${booking.room.name}\n${booking.member?.name || booking.guestName || 'אורח'}`;
  const location = booking.room.name;

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Quick Rooms//Booking System//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${booking.id}@quickrooms.com`,
    `DTSTAMP:${now}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  return ics;
}

function formatDate(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');
  
  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
}

