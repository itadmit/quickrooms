import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { subDays, subMonths, addHours, addDays } from 'date-fns';

const prisma = new PrismaClient();

async function main() {
  // ניקוי ה-DB
  await prisma.transaction.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.meetingRoom.deleteMany();
  await prisma.member.deleteMany();
  await prisma.memberCreditPlan.deleteMany();
  await prisma.space.deleteMany();
  await prisma.owner.deleteMany();

  console.log('🧹 Cleaned database');

  // יצירת Owners
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const owner1 = await prisma.owner.create({
    data: {
      name: 'Owner Demo',
      email: 'owner@example.com',
      password: hashedPassword,
      spaceName: 'WeWork Tel Aviv',
      plan: 'PRO',
    },
  });

  const owner2 = await prisma.owner.create({
    data: {
      name: 'רונית אבידן',
      email: 'ronit@example.com',
      password: hashedPassword,
      spaceName: 'Mindspace Herzliya',
      plan: 'BASIC',
    },
  });

  console.log('👤 Created Owners:', owner1.email, owner2.email);

  // יצירת Spaces
  const space1 = await prisma.space.create({
    data: {
      name: 'WeWork Tel Aviv',
      address: 'Dubnov 7, Tel Aviv',
      ownerId: owner1.id,
      logo: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    },
  });

  const space2 = await prisma.space.create({
    data: {
      name: 'Mindspace Herzliya',
      address: 'Maskit 8, Herzliya Pituach',
      ownerId: owner2.id,
      logo: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=800&q=80',
    },
  });

  const space3 = await prisma.space.create({
    data: {
      name: 'Labs Workspace',
      address: 'Rothschild 12, Tel Aviv',
      ownerId: owner1.id,
      logo: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80',
    },
  });

  console.log('🏢 Created Spaces:', space1.name, space2.name, space3.name);

  // יצירת Rooms ל-Space 1
  const room1 = await prisma.meetingRoom.create({
    data: {
      name: 'חדר יצירתיות',
      capacity: 6,
      creditsPerHour: 2,
      pricePerHour: 50,
      spaceId: space1.id,
      images: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
      minDurationMinutes: 60,
      timeIntervalMinutes: 30,
      floor: 'קומה 1',
      description: 'חדר ישיבות קטן ונוח, מתאים לפגישות יצירתיות וסדנאות. כולל לוח מחיק גדול ומערכת וידאו קונפרנס.',
      amenities: JSON.stringify(['wifi', 'tv', 'whiteboard', 'coffee']),
      specialInstructions: 'ביטול/שינוי בהזמנה אפשרי עד 48 שעות לפני המועד. לא יינתן החזר כספי לאחר ביצוע הזמנה.',
    },
  });

  const room2 = await prisma.meetingRoom.create({
    data: {
      name: 'חדר בורד',
      capacity: 12,
      creditsPerHour: 4,
      pricePerHour: 100,
      spaceId: space1.id,
      images: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80',
      minDurationMinutes: 60,
      timeIntervalMinutes: 30,
      floor: 'קומה 2',
      description: 'חדר ישיבות גדול ומרווח, מתאים לפגישות בורד ולצוותים גדולים. כולל מסך 85 אינץ\' ומערכת שמע מתקדמת.',
      amenities: JSON.stringify(['wifi', 'tv', 'whiteboard', 'coffee']),
      specialInstructions: 'הזמנת חצי יום פירושה מהשעה 07:00 - 16:00. ביטול/שינוי אפשרי עד 24 שעות לפני המועד.',
    },
  });

  const room3 = await prisma.meetingRoom.create({
    data: {
      name: 'תא זום',
      capacity: 1,
      creditsPerHour: 1,
      pricePerHour: 20,
      spaceId: space1.id,
      images: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=800&q=80',
      minDurationMinutes: 30,
      timeIntervalMinutes: 15,
      floor: 'קומה 1',
      description: 'תא זום פרטי ונוח לשיחות וידאו. כולל תאורה מקצועית ומיקרופון מובנה.',
      amenities: JSON.stringify(['wifi', 'tv']),
      specialInstructions: 'מינימום הזמנה 30 דקות. ביטול אפשרי עד 12 שעות לפני המועד.',
    },
  });

  // יצירת Rooms ל-Space 2
  const room4 = await prisma.meetingRoom.create({
    data: {
      name: 'Startup Hub',
      capacity: 8,
      creditsPerHour: 3,
      pricePerHour: 75,
      spaceId: space2.id,
      images: 'https://images.unsplash.com/photo-1497366412874-3415097a27e7?auto=format&fit=crop&w=800&q=80',
      minDurationMinutes: 60,
      timeIntervalMinutes: 30,
      floor: 'קומה 3',
      description: 'חדר ישיבות מודרני עם עיצוב יוקרתי. מתאים לפגישות עם לקוחות ולצוותים קטנים.',
      amenities: JSON.stringify(['wifi', 'tv', 'whiteboard']),
      specialInstructions: 'ביטול/שינוי אפשרי עד 48 שעות לפני המועד. לא יינתן החזר כספי לאחר ביצוע הזמנה.',
    },
  });

  const room5 = await prisma.meetingRoom.create({
    data: {
      name: 'Conference A',
      capacity: 20,
      creditsPerHour: 5,
      pricePerHour: 150,
      spaceId: space2.id,
      images: 'https://images.unsplash.com/photo-1505409628601-edc9af17fda5?auto=format&fit=crop&w=800&q=80',
      minDurationMinutes: 120,
      timeIntervalMinutes: 60,
      floor: 'קומה 1',
      description: 'אולם כנסים גדול ומרשים, מתאים לאירועים, הרצאות ופגישות בורד רשמיות. כולל מערכת הגברה מקצועית.',
      amenities: JSON.stringify(['wifi', 'tv', 'whiteboard', 'coffee']),
      specialInstructions: 'מינימום הזמנה שעתיים. הזמנת חצי יום פירושה מהשעה 07:00 - 16:00. ביטול אפשרי עד 72 שעות לפני המועד.',
    },
  });

  // יצירת Rooms ל-Space 3
  const room6 = await prisma.meetingRoom.create({
    data: {
      name: 'Creative Lab',
      capacity: 10,
      creditsPerHour: 3,
      pricePerHour: 80,
      spaceId: space3.id,
      images: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80',
      minDurationMinutes: 60,
      timeIntervalMinutes: 30,
      floor: 'קומה 2',
      description: 'חדר יצירה וחדשנות עם עיצוב מעורר השראה. מתאים לסדנאות, בריינסטורמינג ופגישות יצירתיות.',
      amenities: JSON.stringify(['wifi', 'whiteboard', 'coffee']),
      specialInstructions: 'ביטול/שינוי אפשרי עד 24 שעות לפני המועד. לא יינתן החזר כספי לאחר ביצוע הזמנה.',
    },
  });

  console.log('🚪 Created 6 Meeting Rooms');

  // יצירת Credit Plans
  const planBasic = await prisma.memberCreditPlan.create({
    data: {
      name: 'בסיסי',
      credits: 10,
      ownerId: owner1.id,
    },
  });

  const planStandard = await prisma.memberCreditPlan.create({
    data: {
      name: 'סטנדרט',
      credits: 20,
      ownerId: owner1.id,
    },
  });

  const planPremium = await prisma.memberCreditPlan.create({
    data: {
      name: 'פרימיום',
      credits: 50,
      ownerId: owner1.id,
    },
  });

  const planMindspace = await prisma.memberCreditPlan.create({
    data: {
      name: 'מנוי חודשי',
      credits: 30,
      ownerId: owner2.id,
    },
  });

  console.log('💳 Created 4 Credit Plans');

  // יצירת Members
  const member1 = await prisma.member.create({
    data: {
      name: 'דניאל כהן',
      email: 'daniel@example.com',
      phone: '050-1234567',
      username: 'daniel',
      password: hashedPassword,
      ownerId: owner1.id,
      creditPlanId: planStandard.id,
      creditBalance: 15,
      allowOveruse: true,
      createdAt: subDays(new Date(), 30),
    },
  });

  const member2 = await prisma.member.create({
    data: {
      name: 'שרה לוי',
      email: 'sara@example.com',
      phone: '052-9876543',
      username: 'sara',
      password: hashedPassword,
      ownerId: owner1.id,
      creditPlanId: planStandard.id,
      creditBalance: 18,
      allowOveruse: false,
      createdAt: subDays(new Date(), 25),
    },
  });

  const member3 = await prisma.member.create({
    data: {
      name: 'יוסי מזרחי',
      email: 'yossi@example.com',
      phone: '054-5551234',
      username: 'yossi',
      password: hashedPassword,
      ownerId: owner1.id,
      creditPlanId: planPremium.id,
      creditBalance: 42,
      allowOveruse: true,
      createdAt: subDays(new Date(), 60),
    },
  });

  const member4 = await prisma.member.create({
    data: {
      name: 'מיכל אברהם',
      email: 'michal@example.com',
      username: 'michal',
      password: hashedPassword,
      phone: '053-7778899',
      ownerId: owner1.id,
      creditPlanId: planBasic.id,
      creditBalance: 3,
      allowOveruse: true,
      createdAt: subDays(new Date(), 15),
    },
  });

  const member5 = await prisma.member.create({
    data: {
      name: 'עומר פרידמן',
      email: 'omer@example.com',
      username: 'omer',
      password: hashedPassword,
      phone: '050-3334455',
      ownerId: owner2.id,
      creditPlanId: planMindspace.id,
      creditBalance: 25,
      allowOveruse: true,
      createdAt: subDays(new Date(), 10),
    },
  });

  console.log('👥 Created 5 Members');

  // יצירת Bookings & Transactions
  const now = new Date();
  
  // Booking 1: Today - Member 1 (Approved, Credits)
  const booking1 = await prisma.booking.create({
    data: {
      roomId: room1.id,
      ownerId: owner1.id,
      memberId: member1.id,
      startTime: addHours(now, 2),
      endTime: addHours(now, 4),
      hours: 2,
      creditsUsed: 4,
      paymentStatus: 'COMPLETED',
    }
  });

  await prisma.transaction.create({
    data: {
      bookingId: booking1.id,
      ownerId: owner1.id,
      memberId: member1.id,
      amount: 0,
      paymentStatus: 'COMPLETED',
    }
  });

  // Booking 2: Today - Guest (Paid with PayPal)
  const booking2 = await prisma.booking.create({
    data: {
      roomId: room2.id,
      ownerId: owner1.id,
      guestName: 'אורח חשוב',
      guestEmail: 'guest@company.com',
      startTime: addHours(now, 5),
      endTime: addHours(now, 7),
      hours: 2,
      priceCharged: 200,
      paymentStatus: 'COMPLETED',
    }
  });

  await prisma.transaction.create({
    data: {
      bookingId: booking2.id,
      ownerId: owner1.id,
      guestEmail: 'guest@company.com',
      amount: 200,
      paymentStatus: 'COMPLETED',
    }
  });

  // Booking 3: Tomorrow - Member 2
  const booking3 = await prisma.booking.create({
    data: {
      roomId: room3.id,
      ownerId: owner1.id,
      memberId: member2.id,
      startTime: addDays(addHours(now, 10), 1),
      endTime: addDays(addHours(now, 11), 1),
      hours: 1,
      creditsUsed: 1,
      paymentStatus: 'COMPLETED',
    }
  });

  await prisma.transaction.create({
    data: {
      bookingId: booking3.id,
      ownerId: owner1.id,
      memberId: member2.id,
      amount: 0,
      paymentStatus: 'COMPLETED',
    }
  });

  // Booking 4: Yesterday - Member 3 (Completed)
  const booking4 = await prisma.booking.create({
    data: {
      roomId: room2.id,
      ownerId: owner1.id,
      memberId: member3.id,
      startTime: subDays(addHours(now, 14), 1),
      endTime: subDays(addHours(now, 17), 1),
      hours: 3,
      creditsUsed: 12,
      paymentStatus: 'COMPLETED',
      createdAt: subDays(now, 1),
    }
  });

  await prisma.transaction.create({
    data: {
      bookingId: booking4.id,
      ownerId: owner1.id,
      memberId: member3.id,
      amount: 0,
      paymentStatus: 'COMPLETED',
      createdAt: subDays(now, 1),
    }
  });

  // Booking 5: Member 4 with Overuse (Paid Extra)
  const booking5 = await prisma.booking.create({
    data: {
      roomId: room1.id,
      ownerId: owner1.id,
      memberId: member4.id,
      startTime: subDays(addHours(now, 9), 3),
      endTime: subDays(addHours(now, 13), 3),
      hours: 4,
      creditsUsed: 3, // Had only 3 credits
      priceCharged: 50, // Paid for 1 extra hour
      paymentStatus: 'COMPLETED',
      createdAt: subDays(now, 3),
    }
  });

  await prisma.transaction.create({
    data: {
      bookingId: booking5.id,
      ownerId: owner1.id,
      memberId: member4.id,
      amount: 50,
      paymentStatus: 'COMPLETED',
      createdAt: subDays(now, 3),
    }
  });

  // Booking 6: Space 2 - Member 5
  const booking6 = await prisma.booking.create({
    data: {
      roomId: room4.id,
      ownerId: owner2.id,
      memberId: member5.id,
      startTime: addHours(now, 3),
      endTime: addHours(now, 6),
      hours: 3,
      creditsUsed: 9,
      paymentStatus: 'COMPLETED',
    }
  });

  await prisma.transaction.create({
    data: {
      bookingId: booking6.id,
      ownerId: owner2.id,
      memberId: member5.id,
      amount: 0,
      paymentStatus: 'COMPLETED',
    }
  });

  // Booking 7: Next week - Member 1
  const booking7 = await prisma.booking.create({
    data: {
      roomId: room2.id,
      ownerId: owner1.id,
      memberId: member1.id,
      startTime: addDays(addHours(now, 14), 7),
      endTime: addDays(addHours(now, 16), 7),
      hours: 2,
      creditsUsed: 8,
      paymentStatus: 'PENDING',
    }
  });

  // Additional Historical Transactions for Revenue Data
  await prisma.transaction.create({
    data: {
      ownerId: owner1.id,
      amount: 5000,
      paymentStatus: 'COMPLETED',
      createdAt: subMonths(now, 1),
    }
  });

  await prisma.transaction.create({
    data: {
      ownerId: owner1.id,
      amount: 3200,
      paymentStatus: 'COMPLETED',
      createdAt: subMonths(now, 2),
    }
  });

  await prisma.transaction.create({
    data: {
      ownerId: owner2.id,
      amount: 2800,
      paymentStatus: 'COMPLETED',
      createdAt: subMonths(now, 1),
    }
  });

  console.log('📅 Created 7 Bookings with Transactions');
  console.log('');
  console.log('✅ Seed completed successfully!');
  console.log('');
  console.log('📋 Summary:');
  console.log('  - 2 Owners');
  console.log('  - 3 Spaces');
  console.log('  - 6 Meeting Rooms');
  console.log('  - 4 Credit Plans');
  console.log('  - 5 Members');
  console.log('  - 7 Bookings');
  console.log('  - 10 Transactions');
  console.log('');
  console.log('🔑 Login credentials:');
  console.log('  Owner: owner@example.com / password123');
  console.log('  Member: daniel@example.com / password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
