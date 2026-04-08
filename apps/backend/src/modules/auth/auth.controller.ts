import { Request, Response, NextFunction } from "express";
import { verifyAndGetDbUser } from "./auth.service";
import { signAccessToken, signRefreshToken } from "../../security/jwt/tokens";
import { setAuthCookies, clearAuthCookies } from "../../security/cookies/auth-cookies";
import { verifyRefreshToken } from "../../security/jwt/verify";

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

export function refreshTokenController(req: Request, res: Response) {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ status: "error", message: "No refresh token" });
    }

    const decoded = verifyRefreshToken(refreshToken) as any;
    const payload = { userId: decoded.userId, role: decoded.role };

    const newAccessToken = signAccessToken(payload);
    
    // We optionally rotate the refresh token here too if requested
    setAuthCookies(res, newAccessToken, refreshToken);

    res.status(200).json({ status: "success", message: "Token refreshed" });
  } catch (error) {
    clearAuthCookies(res);
    res.status(401).json({ status: "error", message: "Invalid refresh token" });
  }
}

export function getSessionController(req: Request, res: Response) {
  // req.user is set by authMiddleware
  res.status(200).json({
    status: "success",
    data: { user: (req as any).user }
  });
}
