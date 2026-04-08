import { Router } from "express";
import { z } from "zod";
import { getProfileController, updateProfileController, uploadImageController } from "./profile.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { validateBody } from "../../middleware/validate.middleware";
import { uploadAvatarMiddleware } from "../../middleware/upload.middleware";

const router = Router();

// Apply auth strictly to /api/profile
router.use(authMiddleware);

// GET /api/profile
router.get("/", getProfileController);

const updateProfileSchema = z.object({
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/).optional(),
  displayName: z.string().min(1).max(50).optional(),
});

// PATCH /api/profile
router.patch("/", validateBody(updateProfileSchema), updateProfileController);

// POST /api/profile/image
router.post("/image", uploadAvatarMiddleware.single("avatar"), uploadImageController);

export default router;
