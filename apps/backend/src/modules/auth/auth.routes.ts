import { Router } from "express";
import { z } from "zod";
import { loginController, logoutController, getSessionController, refreshTokenController } from "./auth.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { authRateLimiter } from "../../middleware/rate-limit.middleware";
import { validateBody } from "../../middleware/validate.middleware";

const router = Router();

const loginSchema = z.object({
  idToken: z.string().min(1, "idToken is required"),
});

// /api/auth/login
router.post("/login", authRateLimiter, validateBody(loginSchema), loginController);

// /api/auth/register (Aliases to login locally as Firebase holds passwords)
router.post("/register", authRateLimiter, validateBody(loginSchema), loginController);

// /api/auth/logout
router.post("/logout", logoutController);

// /api/auth/refresh
router.post("/refresh", refreshTokenController);

// /api/auth/session
router.get("/session", authMiddleware, getSessionController);

export default router;
