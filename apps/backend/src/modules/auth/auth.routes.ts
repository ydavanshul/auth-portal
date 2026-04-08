import { Router } from "express";
import { loginController, logoutController, getSessionController } from "./auth.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { authRateLimiter } from "../../middleware/rate-limit.middleware";

const router = Router();

// /api/auth/login
router.post("/login", authRateLimiter, loginController);

// /api/auth/logout
router.post("/logout", logoutController);

// /api/auth/session
router.get("/session", authMiddleware, getSessionController);

export default router;
