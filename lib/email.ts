import nodemailer from 'nodemailer';
import { prisma } from './prisma';

// יצירת transporter עם הגדרות SMTP של Owner
async function createTransporter(ownerId: string) {
  // טען את הגדרות ה-Owner
  const owner = await prisma.owner.findUnique({
    where: { id: ownerId },
    select: {
      emailEnabled: true,
      smtpHost: true,
      smtpPort: true,
      smtpSecure: true,
      smtpUser: true,
      smtpPass: true,
    },
  });

  if (!owner || !owner.emailEnabled) {
    console.log('Email not enabled for owner:', ownerId);
    return null;
  }

  if (!owner.smtpHost || !owner.smtpUser || !owner.smtpPass) {
    console.warn('SMTP settings not configured for owner:', ownerId);
    return null;
  }

  return nodemailer.createTransport({
    host: owner.smtpHost || 'smtp.gmail.com',
    port: owner.smtpPort || 587,
    secure: owner.smtpSecure || false,
    auth: {
      user: owner.smtpUser,
      pass: owner.smtpPass,
    },
  });
}

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  ownerId: string; // נדרש - ID של ה-Owner
}

// תבנית אימייל (ללא ownerId)
export interface EmailTemplate {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    const transporter = await createTransporter(options.ownerId);
    if (!transporter) {
      console.log('Email not sent (SMTP not configured):', options.subject);
      return false;
    }

    // טען את ה-Owner כדי לקבל את ה-email שלו
    const owner = await prisma.owner.findUnique({
      where: { id: options.ownerId },
      select: { smtpUser: true, name: true },
    });

    const fromEmail = owner?.smtpUser || 'noreply@quickrooms.com';
    const fromName = owner?.name || 'Quick Rooms';

    const mailOptions = {
      from: `"${fromName}" <${fromEmail}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text || options.html.replace(/<[^>]*>/g, ''), // Strip HTML for text version
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

// תבניות אימייל

export function getBookingConfirmationEmail(booking: {
  roomName: string;
  startTime: Date;
  endTime: Date;
  memberName: string;
}): EmailTemplate {
  const startTimeStr = new Date(booking.startTime).toLocaleString('he-IL', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const endTimeStr = new Date(booking.endTime).toLocaleString('he-IL', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return {
    to: '', // יועבר מהקורא
    subject: 'הזמנתך אושרה - Quick Rooms',
    html: `
      <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #4f46e5;">הזמנתך אושרה!</h2>
        <p>שלום ${booking.memberName},</p>
        <p>הזמנתך אושרה בהצלחה:</p>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>חדר:</strong> ${booking.roomName}</p>
          <p><strong>תאריך ושעה:</strong> ${startTimeStr}</p>
          <p><strong>עד:</strong> ${endTimeStr}</p>
        </div>
        <p>נשמח לראותך!</p>
        <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
          Quick Rooms - ניהול חדרי ישיבות
        </p>
      </div>
    `,
  };
}

export function getBookingReminderEmail(booking: {
  roomName: string;
  startTime: Date;
  memberName: string;
  minutesUntil: number;
}): EmailTemplate {
  const startTimeStr = new Date(booking.startTime).toLocaleString('he-IL', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const minutesText = booking.minutesUntil === 30 ? 'חצי שעה' : 
                      booking.minutesUntil === 60 ? 'שעה' : 
                      `${booking.minutesUntil} דקות`;

  return {
    to: '', // יועבר מהקורא
    subject: `תזכורת: פגישה בעוד ${minutesText} - Quick Rooms`,
    html: `
      <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #4f46e5;">תזכורת להזמנה</h2>
        <p>שלום ${booking.memberName},</p>
        <p>זה תזכורת שהזמנתך מתחילה בעוד ${minutesText}:</p>
        <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-right: 4px solid #f59e0b;">
          <p><strong>חדר:</strong> ${booking.roomName}</p>
          <p><strong>שעה:</strong> ${startTimeStr}</p>
        </div>
        <p>נשמח לראותך!</p>
        <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
          Quick Rooms - ניהול חדרי ישיבות
        </p>
      </div>
    `,
  };
}

export function getLowCreditsEmail(member: {
  name: string;
  creditBalance: number;
}): EmailTemplate {
  return {
    to: '', // יועבר מהקורא
    subject: 'יתרת קרדיטים נמוכה - Quick Rooms',
    html: `
      <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #dc2626;">יתרת קרדיטים נמוכה</h2>
        <p>שלום ${member.name},</p>
        <p>יתרת הקרדיטים שלך נמוכה:</p>
        <div style="background-color: #fee2e2; padding: 20px; border-radius: 8px; margin: 20px 0; border-right: 4px solid #dc2626;">
          <p style="font-size: 24px; font-weight: bold; color: #dc2626;">${member.creditBalance} קרדיטים</p>
        </div>
        <p>אנא צור קשר עם המנהל שלך כדי לטעון קרדיטים נוספים.</p>
        <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
          Quick Rooms - ניהול חדרי ישיבות
        </p>
      </div>
    `,
  };
}

export function getMonthlyReportEmail(owner: {
  name: string;
  stats: {
    totalBookings: number;
    totalRevenue: number;
    activeMembers: number;
  };
}): EmailTemplate {
  return {
    to: '', // יועבר מהקורא
    subject: 'דוח חודשי - Quick Rooms',
    html: `
      <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #4f46e5;">דוח חודשי</h2>
        <p>שלום ${owner.name},</p>
        <p>להלן סיכום הפעילות החודשית שלך:</p>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>סה"כ הזמנות:</strong> ${owner.stats.totalBookings}</p>
          <p><strong>סה"כ הכנסות:</strong> ₪${owner.stats.totalRevenue.toFixed(2)}</p>
          <p><strong>חברים פעילים:</strong> ${owner.stats.activeMembers}</p>
        </div>
        <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
          Quick Rooms - ניהול חדרי ישיבות
        </p>
      </div>
    `,
  };
}

