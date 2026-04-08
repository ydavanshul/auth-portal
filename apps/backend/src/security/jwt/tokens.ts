import jwt from "jsonwebtoken";

interface TokenPayload {
  userId: string;
  role: string;
}

export function signAccessToken(payload: TokenPayload): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not defined");

  return jwt.sign(payload, secret, {
    expiresIn: "15m", // Short-lived access token
    algorithm: "HS256"
  });
}

export function signRefreshToken(payload: TokenPayload): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not defined");

  return jwt.sign(payload, secret, {
    expiresIn: "7d", // Longer-lived refresh token
    algorithm: "HS256"
  });
}
