import { Request, Response, NextFunction } from "express";
import { getProfile, updateProfile, uploadProfileImage } from "./profile.service";

export async function getProfileController(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user.userId;
    const profile = await getProfile(userId);

    if (!profile) return res.status(404).json({ status: "error", message: "Profile not found" });

    res.status(200).json({ status: "success", data: profile });
  } catch (error) {
    next(error);
  }
}

export async function updateProfileController(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user.userId;
    const { username, displayName } = req.body;

    const updated = await updateProfile(userId, { username, displayName });
    
    res.status(200).json({ status: "success", data: updated });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({ status: "error", message: "Username already taken." });
    }
    next(error);
  }
}

export async function uploadImageController(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user.userId;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ status: "error", message: "File is required." });
    }

    const publicUrl = await uploadProfileImage(userId, file);

    res.status(200).json({ status: "success", data: { profileImage: publicUrl } });
  } catch (error) {
    next(error);
  }
}
