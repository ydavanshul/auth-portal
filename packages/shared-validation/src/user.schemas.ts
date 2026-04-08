import { z } from "zod";
import { Role } from "@monorepo/shared-types";

export const UserSchema = z.object({
  id: z.string(),
  firebaseUid: z.string(),
  email: z.string().email(),
  name: z.string().nullable(),
  role: z.nativeEnum(Role),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
});

export const UpdateUserSchema = z.object({
  name: z.string().optional(),
  role: z.nativeEnum(Role).optional(),
});
