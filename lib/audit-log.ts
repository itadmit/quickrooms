import { prisma } from './prisma';

export interface AuditLogData {
  userId: string;
  userRole: string;
  action: string;
  entityType: string;
  entityId?: string;
  details?: any;
  ipAddress?: string;
  userAgent?: string;
  ownerId?: string;
}

export async function createAuditLog(data: AuditLogData) {
  try {
    await prisma.auditLog.create({
      data: {
        userId: data.userId,
        userRole: data.userRole,
        action: data.action,
        entityType: data.entityType,
        entityId: data.entityId,
        details: data.details ? JSON.stringify(data.details) : null,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        ownerId: data.ownerId,
      },
    });
  } catch (error) {
    console.error('Error creating audit log:', error);
    // Don't throw - audit logging shouldn't break the main flow
  }
}

