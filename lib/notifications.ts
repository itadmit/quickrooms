import { prisma } from './prisma';
import { sendEmail, getBookingConfirmationEmail, getBookingReminderEmail, getLowCreditsEmail, getMonthlyReportEmail } from './email';

export type NotificationType = 
  | 'BOOKING_CONFIRMED'
  | 'BOOKING_REMINDER'
  | 'LOW_CREDITS'
  | 'MONTHLY_REPORT'
  | 'BOOKING_CANCELLED'
  | 'PAYMENT_RECEIVED';

export interface CreateNotificationParams {
  userId: string;
  userRole: 'OWNER' | 'MEMBER';
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  sendEmail?: boolean;
  emailTo?: string;
  ownerId: string; // נדרש לשליחת אימייל
}

/**
 * יצירת התראה במערכת
 */
export async function createNotification(params: CreateNotificationParams) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId: params.userId,
        userRole: params.userRole,
        type: params.type,
        title: params.title,
        message: params.message,
        link: params.link || null,
        emailSent: false,
      },
    });

    // שליחת אימייל אם נדרש
    if (params.sendEmail && params.emailTo) {
      let emailOptions;
      
      switch (params.type) {
        case 'BOOKING_CONFIRMED':
          // צריך להעביר booking data
          emailOptions = {
            to: params.emailTo,
            subject: params.title,
            html: params.message,
          };
          break;
        case 'BOOKING_REMINDER':
          emailOptions = {
            to: params.emailTo,
            subject: params.title,
            html: params.message,
          };
          break;
        case 'LOW_CREDITS':
          emailOptions = {
            to: params.emailTo,
            subject: params.title,
            html: params.message,
          };
          break;
        default:
          emailOptions = {
            to: params.emailTo,
            subject: params.title,
            html: params.message,
          };
      }

      const emailSent = await sendEmail({
        ...emailOptions,
        ownerId: params.ownerId,
      });
      
      if (emailSent) {
        await prisma.notification.update({
          where: { id: notification.id },
          data: {
            emailSent: true,
            emailSentAt: new Date(),
          },
        });
      }
    }

    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
}

/**
 * שליחת תזכורות להזמנות קרובות
 */
export async function sendBookingReminders() {
  try {
    const now = new Date();
    let totalRemindersSent = 0;
    
    // מצא כל ההזמנות שמתחילות בעוד 30 דקות
    const reminderTimes = [30]; // ניתן להוסיף 15, 60, 120 וכו'
    
    for (const minutes of reminderTimes) {
      const reminderTime = new Date(now.getTime() + minutes * 60 * 1000);
      const reminderTimeEnd = new Date(reminderTime.getTime() + 5 * 60 * 1000); // חלון של 5 דקות
      
      const bookings = await prisma.booking.findMany({
        where: {
          startTime: {
            gte: reminderTime,
            lt: reminderTimeEnd,
          },
          memberId: {
            not: null, // רק הזמנות של Members
          },
        },
        include: {
          member: {
            include: {
              owner: true,
            },
          },
          room: {
            include: {
              space: {
                include: {
                  owner: true,
                },
              },
            },
          },
        },
      });

      for (const booking of bookings) {
        if (!booking.member) continue;

        // בדוק אם המשתמש רוצה תזכורות
        // כרגע נשלח לכולם, ניתן להוסיף בדיקה לפי הגדרות
        
        // בדוק אם כבר נשלחה תזכורת
        const existingNotification = await prisma.notification.findFirst({
          where: {
            userId: booking.memberId!,
            type: 'BOOKING_REMINDER',
            message: {
              contains: booking.room.name,
            },
            createdAt: {
              gte: new Date(now.getTime() - 60 * 60 * 1000), // בשעה האחרונה
            },
          },
        });

        if (existingNotification) {
          continue; // כבר נשלחה תזכורת
        }

        const reminderEmail = getBookingReminderEmail({
          roomName: booking.room.name,
          startTime: booking.startTime,
          memberName: booking.member.name,
          minutesUntil: minutes,
        });

        await createNotification({
          userId: booking.memberId!,
          userRole: 'MEMBER',
          type: 'BOOKING_REMINDER',
          title: `תזכורת: פגישה בעוד ${minutes} דקות`,
          message: reminderEmail.html,
          link: `/dashboard/member/bookings`,
          sendEmail: true,
          emailTo: booking.member.email,
          ownerId: booking.room.space.ownerId,
        });

        totalRemindersSent++;
      }
    }

    return { success: true, remindersSent: totalRemindersSent };
  } catch (error) {
    console.error('Error sending booking reminders:', error);
    throw error;
  }
}

/**
 * בדיקת קרדיטים נמוכים ושליחת התראות
 */
export async function checkLowCredits() {
  try {
    const threshold = 5; // סף של 5 קרדיטים
    
    const members = await prisma.member.findMany({
      where: {
        AND: [
          {
            creditBalance: {
              lte: threshold,
            },
          },
          {
            creditBalance: {
              gt: 0, // לא כולל 0
            },
          },
        ],
      },
      include: {
        owner: true,
      },
    });

    for (const member of members) {
      // בדוק אם כבר נשלחה התראה לאחרונה
      const existingNotification = await prisma.notification.findFirst({
        where: {
          userId: member.id,
          type: 'LOW_CREDITS',
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // בשבוע האחרון
          },
        },
      });

      if (existingNotification) {
        continue;
      }

      const lowCreditsEmail = getLowCreditsEmail({
        name: member.name,
        creditBalance: member.creditBalance,
      });

      await createNotification({
        userId: member.id,
        userRole: 'MEMBER',
        type: 'LOW_CREDITS',
        title: 'יתרת קרדיטים נמוכה',
        message: lowCreditsEmail.html,
        link: '/dashboard/member',
        sendEmail: true,
        emailTo: member.email,
        ownerId: member.ownerId,
      });
    }

    return { success: true, notificationsSent: members.length };
  } catch (error) {
    console.error('Error checking low credits:', error);
    throw error;
  }
}

/**
 * שליחת התראה על הזמנה מאושרת
 */
export async function sendBookingConfirmation(bookingId: string) {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        member: true,
        room: {
          include: {
            space: {
              include: {
                owner: true,
              },
            },
          },
        },
      },
    });

    if (!booking || !booking.member) {
      return;
    }

    const confirmationEmail = getBookingConfirmationEmail({
      roomName: booking.room.name,
      startTime: booking.startTime,
      endTime: booking.endTime,
      memberName: booking.member.name,
    });

    await createNotification({
      userId: booking.memberId!,
      userRole: 'MEMBER',
      type: 'BOOKING_CONFIRMED',
      title: 'הזמנתך אושרה',
      message: confirmationEmail.html,
      link: `/dashboard/member/bookings`,
      sendEmail: true,
      emailTo: booking.member.email,
      ownerId: booking.room.space.ownerId,
    });
  } catch (error) {
    console.error('Error sending booking confirmation:', error);
  }
}

