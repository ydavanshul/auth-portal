import { firebaseAdmin } from "../../config/firebase-admin";
import { prisma } from "../../config/prisma";
import { User, Role } from "@prisma/client"; // Or from @monorepo/shared-types

export async function verifyAndGetDbUser(idToken: string): Promise<User> {
  // 1. Verify Firebase token
  const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
  const { uid, email, name } = decodedToken;

  if (!email) {
    throw new Error("Email is required for authentication");
  }

  // 2. Find or Create User in PostgreSQL (Prisma)
  let user = await prisma.user.findUnique({
    where: { firebaseUid: uid },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        firebaseUid: uid,
        email: email,
        name: name || null,
        role: "USER" // Default role
      },
    });
  }

  return user;
}

export async function createSession(userId: string, refreshToken: string, req: any) {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

  return prisma.session.create({
    data: {
      userId,
      refreshToken,
      userAgent: req.headers["user-agent"] || null,
      ipAddress: req.ip || null,
      expiresAt
    }
  });
}

export async function revokeSession(refreshToken: string) {
  return prisma.session.delete({
    where: { refreshToken }
  }).catch(() => null); // ignore if not found
}
