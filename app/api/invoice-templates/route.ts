import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { createAuditLog } from '@/lib/audit-log';

// GET - קבלת תבניות חשבוניות
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

    const templates = await prisma.invoiceTemplate.findMany({
      where: {
        ownerId: user.id,
      },
      orderBy: {
        isDefault: 'desc',
      },
    });

    return NextResponse.json({ templates });
  } catch (error) {
    console.error('Error fetching invoice templates:', error);
    return NextResponse.json(
      { error: 'שגיאה בטעינת תבניות חשבוניות' },
      { status: 500 }
    );
  }
}

// POST - יצירת תבנית חשבונית חדשה
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'לא מאומת' }, { status: 401 });
    }

    const user = await verifyToken(token);
    if (!user || user.role !== 'OWNER') {
      return NextResponse.json({ error: 'גישה נדחתה' }, { status: 403 });
    }

    const { name, template, isDefault } = await request.json();

    if (!name || !template) {
      return NextResponse.json(
        { error: 'שם ותבנית נדרשים' },
        { status: 400 }
      );
    }

    // אם זה ברירת מחדל, בטל את כל האחרות
    if (isDefault) {
      await prisma.invoiceTemplate.updateMany({
        where: {
          ownerId: user.id,
          isDefault: true,
        },
        data: {
          isDefault: false,
        },
      });
    }

    const invoiceTemplate = await prisma.invoiceTemplate.create({
      data: {
        ownerId: user.id,
        name,
        template,
        isDefault: isDefault || false,
      },
    });

    await createAuditLog({
      userId: user.id,
      userRole: user.role,
      action: 'CREATE_INVOICE_TEMPLATE',
      entityType: 'InvoiceTemplate',
      entityId: invoiceTemplate.id,
      ownerId: user.id,
    });

    return NextResponse.json({ template: invoiceTemplate }, { status: 201 });
  } catch (error) {
    console.error('Error creating invoice template:', error);
    return NextResponse.json(
      { error: 'שגיאה ביצירת תבנית חשבונית' },
      { status: 500 }
    );
  }
}

