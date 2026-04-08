import { Router } from "express";
import { authenticate, authorize } from "../../middleware/auth";
import { Role } from "@monorepo/shared-types";

const router = Router();

// /api/manager/dashboard
router.get("/dashboard", authenticate, authorize([Role.MANAGER, Role.ADMIN]), (req, res) => {
  res.json({ message: "Welcome to the Manager Dashboard" });
});

export default router;
