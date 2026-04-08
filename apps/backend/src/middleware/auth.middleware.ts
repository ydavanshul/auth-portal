import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../security/jwt/verify";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies["access_token"];

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const decoded = verifyAccessToken(token);
    (req as any).user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
