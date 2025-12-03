import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { prisma } from './prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const secret = new TextEncoder().encode(JWT_SECRET);

export interface AuthUser {
  id: string;
  email: string;
  role: 'OWNER' | 'MEMBER';
  name: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export async function generateToken(user: AuthUser): Promise<string> {
  return await new SignJWT({ id: user.id, email: user.email, role: user.role })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(secret);
}

export async function verifyToken(token: string): Promise<AuthUser | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as AuthUser;
  } catch (error) {
    console.error('[verifyToken] Error:', error instanceof Error ? error.message : error);
    return null;
  }
}

export async function authenticateOwner(email: string, password: string): Promise<AuthUser | null> {
  const owner = await prisma.owner.findUnique({
    where: { email },
  });

  if (!owner) return null;

  const isValid = await verifyPassword(password, owner.password);
  if (!isValid) return null;

  return {
    id: owner.id,
    email: owner.email,
    role: 'OWNER',
    name: owner.name,
  };
}

export async function authenticateMember(email: string, password: string): Promise<AuthUser | null> {
  const member = await prisma.member.findUnique({
    where: { email },
  });

  if (!member) return null;

  const isValid = await verifyPassword(password, member.password);
  if (!isValid) return null;

  return {
    id: member.id,
    email: member.email,
    role: 'MEMBER',
    name: member.name,
  };
}

