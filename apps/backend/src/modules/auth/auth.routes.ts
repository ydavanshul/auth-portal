import { Router } from "express";
import { loginController, logoutController, getSessionController, refreshTokenController } from "./auth.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { authRateLimiter } from "../../middleware/rate-limit.middleware";

const router = Router();

// /api/auth/login
router.post("/login", authRateLimiter, loginController);

// /api/auth/register (Aliases to login locally as Firebase holds passwords)
router.post("/register", authRateLimiter, loginController);

// /api/auth/logout
router.post("/logout", logoutController);

// /api/auth/refresh
router.post("/refresh", refreshTokenController);

// /api/auth/session
router.get("/session", authMiddleware, getSessionController);

export default router;
