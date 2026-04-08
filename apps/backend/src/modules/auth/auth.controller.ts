import { Request, Response, NextFunction } from "express";
import { verifyAndGetDbUser } from "./auth.service";
import { signAccessToken, signRefreshToken } from "../../security/jwt/tokens";
import { setAuthCookies, clearAuthCookies } from "../../security/cookies/auth-cookies";

export async function loginController(req: Request, res: Response, next: NextFunction) {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({ status: "error", message: "idToken is required" });
    }

    const user = await verifyAndGetDbUser(idToken);

    // Create session tokens
    const payload = { userId: user.id, role: user.role };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    // Send HTTP-Only Cookies
    setAuthCookies(res, accessToken, refreshToken);

    res.status(200).json({
      status: "success",
      data: {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        }
      }
    });

  } catch (error) {
    next(error);
  }
}

export function logoutController(req: Request, res: Response) {
  clearAuthCookies(res);
  res.status(200).json({ status: "success", message: "Logged out" });
}

export function getSessionController(req: Request, res: Response) {
  // req.user is set by authMiddleware
  res.status(200).json({
    status: "success",
    data: { user: (req as any).user }
  });
}
