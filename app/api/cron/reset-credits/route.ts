import { NextRequest, NextResponse } from 'next/server';
import { resetMonthlyCredits } from '@/lib/credit-reset';

// POST - Endpoint ל-cron job לאיפוס קרדיטים חודשי
// יש להגן על endpoint זה עם API key או IP whitelist
export async function POST(request: NextRequest) {
  try {
    // TODO: Add authentication/authorization check
    // For example: check for API key in headers
    const apiKey = request.headers.get('x-api-key');
    const expectedApiKey = process.env.CRON_API_KEY;

    if (apiKey !== expectedApiKey) {
      return NextResponse.json(
        { error: 'לא מאומת' },
        { status: 401 }
      );
    }

    const result = await resetMonthlyCredits();

    return NextResponse.json({
      success: true,
      message: `אופסו קרדיטים ל-${result.membersReset} Members`,
      membersReset: result.membersReset,
    });
  } catch (error) {
    console.error('Error in reset credits cron:', error);
    return NextResponse.json(
      { error: 'שגיאה באיפוס קרדיטים' },
      { status: 500 }
    );
  }
}

