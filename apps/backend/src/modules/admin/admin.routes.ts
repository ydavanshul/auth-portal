import { Router } from "express";
import { authenticate, authorize } from "../../middleware/auth";
import { Role } from "@monorepo/shared-types";
import { prisma } from "../../config/prisma";

const router = Router();

// /api/admin/users
router.get("/users", authenticate, authorize([Role.ADMIN]), async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
});

// /api/admin/users/:id/role
router.patch("/users/:id/role", authenticate, authorize([Role.ADMIN]), async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;

    if (!Object.values(Role).includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
    }

    try {
        const updatedUser = await prisma.user.update({
            where: { id },
            data: { role },
        });
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: "Error updating user role" });
    }
});

export default router;
