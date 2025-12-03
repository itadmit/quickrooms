import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { createAuditLog } from '@/lib/audit-log';

// GET - קבלת הגדרות Branding
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'לא מאומת' }, { status: 401 });
    }

    const user = await verifyToken(token);
    if (!user || user.role !== 'OWNER') {
      return NextResponse.json({ error: 'גישה נדחתה' }, { status: 403 });
    }

    let branding = await prisma.brandingSettings.findUnique({
      where: { ownerId: user.id },
    });

    if (!branding) {
      // יצירת הגדרות ברירת מחדל
      branding = await prisma.brandingSettings.create({
        data: {
          ownerId: user.id,
          companyName: 'Quick Rooms',
        },
      });
    }

    return NextResponse.json({ branding });
  } catch (error) {
    console.error('Error fetching branding:', error);
    return NextResponse.json(
      { error: 'שגיאה בטעינת הגדרות Branding' },
      { status: 500 }
    );
  }
}

// PUT - עדכון הגדרות Branding
export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'לא מאומת' }, { status: 401 });
    }

    const user = await verifyToken(token);
    if (!user || user.role !== 'OWNER') {
      return NextResponse.json({ error: 'גישה נדחתה' }, { status: 403 });
    }

    const { logoUrl, primaryColor, secondaryColor, companyName, customDomain } = await request.json();

    let branding = await prisma.brandingSettings.findUnique({
      where: { ownerId: user.id },
    });

    if (branding) {
      branding = await prisma.brandingSettings.update({
        where: { ownerId: user.id },
        data: {
          logoUrl,
          primaryColor,
          secondaryColor,
          companyName,
          customDomain,
        },
      });
    } else {
      branding = await prisma.brandingSettings.create({
        data: {
          ownerId: user.id,
          logoUrl,
          primaryColor,
          secondaryColor,
          companyName,
          customDomain,
        },
      });
    }

    await createAuditLog({
      userId: user.id,
      userRole: user.role,
      action: 'UPDATE_BRANDING',
      entityType: 'BrandingSettings',
      entityId: branding.id,
      ownerId: user.id,
    });

    return NextResponse.json({ branding });
  } catch (error) {
    console.error('Error updating branding:', error);
    return NextResponse.json(
      { error: 'שגיאה בעדכון הגדרות Branding' },
      { status: 500 }
    );
  }
}

