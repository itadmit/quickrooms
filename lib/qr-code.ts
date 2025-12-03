import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function generateQRCodeForBooking(bookingId: string) {
  try {
    // בדיקה אם כבר יש QR code
    const existing = await prisma.bookingQRCode.findUnique({
      where: { bookingId },
    });

    if (existing) {
      return existing;
    }

    // יצירת token ייחודי
    const token = crypto.randomBytes(32).toString('hex');
    
    // יצירת QR code data (URL או JSON)
    const qrData = JSON.stringify({
      bookingId,
      token,
      type: 'booking',
    });

    const qrCode = await prisma.bookingQRCode.create({
      data: {
        bookingId,
        qrCode: qrData,
        token,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    });

    return qrCode;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
}

export async function verifyQRToken(token: string) {
  try {
    const qrCode = await prisma.bookingQRCode.findUnique({
      where: { token },
      include: {
        booking: {
          include: {
            room: true,
            member: true,
          },
        },
      },
    });

    if (!qrCode) {
      return null;
    }

    if (qrCode.expiresAt && qrCode.expiresAt < new Date()) {
      return null;
    }

    return qrCode;
  } catch (error) {
    console.error('Error verifying QR token:', error);
    return null;
  }
}

