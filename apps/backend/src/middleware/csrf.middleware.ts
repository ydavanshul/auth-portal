import { Request, Response, NextFunction } from "express";
import crypto from "crypto";

export function generateCsrfToken(req: Request, res: Response, next: NextFunction) {
  const token = crypto.randomUUID();
  res.cookie("XSRF-TOKEN", token, {
    httpOnly: false, // Accessible by client to send back
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/"
  });
  req.csrfToken = token;
  next();
}

export function verifyCsrfToken(req: Request, res: Response, next: NextFunction) {
  const cookieToken = req.cookies["XSRF-TOKEN"];
  const headerToken = req.headers["x-csrf-token"];
  
  if (req.method === "GET" || req.method === "HEAD" || req.method === "OPTIONS") {
    return next();
  }

  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    return res.status(403).json({ message: "Invalid CSRF Token" });
  }

  next();
}
