import { Request, Response, NextFunction } from "express";
import { firebaseAdmin } from "../config/firebase-admin";
import { prisma } from "../config/prisma";
import { Role } from "@monorepo/shared-types";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    firebaseUid: string;
    email: string;
    role: Role;
  };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
    const firebaseUid = decodedToken.uid;

    // Fetch user from DB
    let user = await prisma.user.findUnique({
      where: { firebaseUid },
    });

    // If user doesn't exist in our DB but exists in Firebase, create it
    if (!user) {
      user = await prisma.user.create({
        data: {
          firebaseUid,
          email: decodedToken.email || "",
          name: decodedToken.name || null,
          role: "USER", // Default role
        },
      });
    }

    req.user = {
        id: user.id,
        firebaseUid: user.firebaseUid,
        email: user.email,
        role: user.role as Role,
    };

    next();
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const authorize = (roles: Role[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }
    next();
  };
};
