import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { getCache, setCache, getCacheKey, clearCache } from '@/lib/cache';

// GET - קבלת רשימת כל המתחמים (ציבורי)
export async function GET(request: NextRequest) {
  try {
    // Check cache
    const cacheKey = getCacheKey('/api/spaces');
    const cached = getCache<{ spaces: any[] }>(cacheKey);
    if (cached) {
      return NextResponse.json(cached, {
        headers: {
          'X-Cache': 'HIT',
        },
      });
    }

    const spaces = await prisma.space.findMany({
      include: {
        owner: {
          select: {
            name: true,
            spaceName: true,
          },
        },
        meetingRooms: {
          select: {
            id: true,
            name: true,
            capacity: true,
            images: true,
            creditsPerHour: true,
            pricePerHour: true,
          },
        },
      },
    });

    const response = { spaces };
    
    // Cache for 120 seconds (spaces change less frequently)
    setCache(cacheKey, response, 120);

    return NextResponse.json(response, {
      headers: {
        'X-Cache': 'MISS',
      },
    });
  } catch (error) {
    console.error('Error fetching spaces:', error);
    return NextResponse.json(
      { error: 'שגיאה בטעינת המתחמים' },
      { status: 500 }
    );
  }
}

// POST - יצירת מתחם חדש (Owner only)
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

    const body = await request.json();
    const { name, address, logo } = body;

    if (!name || !address) {
      return NextResponse.json(
        { error: 'שם וכתובת נדרשים' },
        { status: 400 }
      );
    }

    const space = await prisma.space.create({
      data: {
        name,
        address,
        logo: logo || null,
        ownerId: user.id,
      },
      include: {
        meetingRooms: true,
      },
    });

    // Clear cache
    clearCache('/api/spaces');

    return NextResponse.json({ space }, { status: 201 });
  } catch (error) {
    console.error('Error creating space:', error);
    return NextResponse.json(
      { error: 'שגיאה ביצירת המתחם' },
      { status: 500 }
    );
  }
}

