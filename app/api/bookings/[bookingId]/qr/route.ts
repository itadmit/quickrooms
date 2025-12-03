import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { generateQRCodeForBooking } from '@/lib/qr-code';
import { createAuditLog } from '@/lib/audit-log';
import QRCode from 'qrcode';

// GET - קבלת QR code להזמנה
export async function GET(
  request: NextRequest,
  { params }: { params: { bookingId: string } }
) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'לא מאומת' }, { status: 401 });
    }

    const user = await verifyToken(token);
    if (!user) {
      return NextResponse.json({ error: 'לא מאומת' }, { status: 401 });
    }

    const { bookingId } = params;
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3010';
    const qrUrl = `${baseUrl}/check-in/${bookingId}`;

    // Generate QR code image
    const qrCodeDataURL = await QRCode.toDataURL(qrUrl, {
      width: 300,
      margin: 2,
    });

    await createAuditLog({
      userId: user.id,
      userRole: user.role,
      action: 'VIEW_QR_CODE',
      entityType: 'Booking',
      entityId: bookingId,
      ownerId: user.role === 'OWNER' ? user.id : undefined,
    });

    return NextResponse.json({
      qrCode: qrCodeDataURL,
      url: qrUrl,
    });
  } catch (error) {
    console.error('Error generating QR code:', error);
    return NextResponse.json(
      { error: 'שגיאה ביצירת QR code' },
      { status: 500 }
    );
  }
}

