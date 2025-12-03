import { NextRequest, NextResponse } from 'next/server';
import { sendBookingReminders, checkLowCredits } from '@/lib/notifications';

/**
 * Cron Job לשליחת תזכורות
 * מופעל כל 30 דקות (Vercel Cron)
 */
export async function GET(request: NextRequest) {
  try {
    // בדיקת Vercel Cron (Vercel שולח header זה)
    const vercelCron = request.headers.get('x-vercel-cron');
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET || process.env.CRON_API_KEY;
    
    // Vercel Cron או Authorization header
    if (!vercelCron && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'לא מאומת' },
        { status: 401 }
      );
    }

    // שליחת תזכורות להזמנות
    const remindersResult = await sendBookingReminders();
    
    // בדיקת קרדיטים נמוכים
    const lowCreditsResult = await checkLowCredits();

    return NextResponse.json({
      success: true,
      reminders: {
        sent: remindersResult.remindersSent || 0,
      },
      lowCredits: {
        notificationsSent: lowCreditsResult.notificationsSent || 0,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in send reminders cron:', error);
    return NextResponse.json(
      { 
        error: 'שגיאה בשליחת תזכורות',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// גם POST לתאימות
export async function POST(request: NextRequest) {
  return GET(request);
}

