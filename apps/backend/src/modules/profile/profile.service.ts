import { prisma } from "../../config/prisma";
import { storage } from "../../config/firebase-admin";

export async function getProfile(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      username: true,
      displayName: true,
      profileImage: true,
      role: true,
      createdAt: true,
    }
  });
}

export async function updateProfile(userId: string, data: { username?: string; displayName?: string }) {
  // Enforce unique username check natively through Prisma throwing P2002
  // but we could explicitly check here if we want nicer error mapping.
  
  return prisma.user.update({
    where: { id: userId },
    data: {
      ...(data.username && { username: data.username.toLowerCase() }),
      ...(data.displayName && { displayName: data.displayName }),
    },
    select: {
      id: true,
      username: true,
      displayName: true
    }
  });
}

export async function uploadProfileImage(userId: string, file: Express.Multer.File) {
  const bucket = storage.bucket();
  // Safe naming
  const ext = file.originalname.split('.').pop()?.replace(/[^a-zA-Z0-9]/g, '');
  const destination = `avatars/${userId}-${Date.now()}.${ext}`;

  const fileUpload = bucket.file(destination);

  await fileUpload.save(file.buffer, {
    metadata: {
      contentType: file.mimetype,
    },
  });

  // Make it public immediately to retrieve the URL
  await fileUpload.makePublic();

  const publicUrl = fileUpload.publicUrl();

  // Update Postgres
  await prisma.user.update({
    where: { id: userId },
    data: { profileImage: publicUrl }
  });

  return publicUrl;
}
