import { Router, Request, Response } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";
import { prisma } from "../../config/prisma";

const router = Router();

// Secure all admin routes explicitly
router.use(authMiddleware);
router.use(requireRole(["ADMIN", "SUPER_ADMIN"]));

// GET /api/admin/users
router.get("/users", async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        isActive: true,
        createdAt: true
      }
    });
    res.status(200).json({ status: "success", data: users });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Error fetching users" });
  }
});

// PATCH /api/admin/users/:id/role
router.patch("/users/:id/role", async (req: Request, res: Response) => {
    const { id } = req.params;
    const { role } = req.body;

    if (!["USER", "ADMIN", "MANAGER", "SUPER_ADMIN"].includes(role)) {
        return res.status(400).json({ status: "error", message: "Invalid role specified." });
    }

    // Safety constraint: Protect SUPER_ADMIN promotion
    const callerRole = (req as any).user.role;
    if (role === "SUPER_ADMIN" && callerRole !== "SUPER_ADMIN") {
      return res.status(403).json({ status: "error", message: "Only SUPER_ADMIN can promote others to SUPER_ADMIN" });
    }

    try {
        const updatedUser = await prisma.user.update({
            where: { id },
            data: { role },
            select: { id: true, email: true, role: true }
        });
        res.status(200).json({ status: "success", data: updatedUser });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Error updating user role" });
    }
});

// PATCH /api/admin/users/:id/status
router.patch("/users/:id/status", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { isActive } = req.body;

  if (typeof isActive !== "boolean") {
      return res.status(400).json({ status: "error", message: "isActive boolean required." });
  }

  try {
      const updatedUser = await prisma.user.update({
          where: { id },
          data: { isActive },
          select: { id: true, email: true, isActive: true }
      });

      // If user is disabled, optimally we would revoke their sessions here.
      if (!isActive) {
         await prisma.session.deleteMany({ where: { userId: id } });
      }

      res.status(200).json({ status: "success", data: updatedUser });
  } catch (error) {
      res.status(500).json({ status: "error", message: "Error updating user status" });
  }
});

export default router;
