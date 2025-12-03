import { prisma } from './prisma';

/**
 * מנגנון איפוס קרדיטים חודשי
 * יש לקרוא לפונקציה זו פעם ביום (למשל עם cron job)
 */
export async function resetMonthlyCredits() {
  try {
    const now = new Date();
    const oneMonthAgo = new Date(now);
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    // מצא כל ה-Members שצריך לאפס להם קרדיטים
    const members = await prisma.member.findMany({
      where: {
        lastCreditReset: {
          lt: oneMonthAgo,
        },
        creditPlanId: {
          not: null,
        },
      },
      include: {
        creditPlan: true,
      },
    });

    for (const member of members) {
      if (member.creditPlan) {
        // איפוס הקרדיטים לפי החבילה
        await prisma.member.update({
          where: { id: member.id },
          data: {
            creditBalance: member.creditPlan.credits,
            lastCreditReset: now,
          },
        });
      }
    }

    return {
      success: true,
      membersReset: members.length,
    };
  } catch (error) {
    console.error('Error resetting monthly credits:', error);
    throw error;
  }
}

