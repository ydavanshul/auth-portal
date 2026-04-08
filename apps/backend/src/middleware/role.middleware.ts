import { Request, Response, NextFunction } from "express";

export function requireRole(allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user || !user.role) {
      return res.status(403).json({ status: "error", message: "Forbidden: Missing role" });
    }

    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({ status: "error", message: "Forbidden: Insufficient privileges" });
    }

    next();
  };
}
