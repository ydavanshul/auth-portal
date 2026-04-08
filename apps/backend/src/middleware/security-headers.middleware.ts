import { Request, Response, NextFunction } from "express";

export function securityHeadersMiddleware(req: Request, res: Response, next: NextFunction) {
  // Helmet will cover most of these, but we can enforce specifics here if needed
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  
  // Minimal CSP
  res.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'self'; object-src 'none';");
  next();
}
