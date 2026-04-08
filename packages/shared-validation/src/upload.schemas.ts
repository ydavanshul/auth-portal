import { z } from "zod";
export const UploadSchema = z.object({ url: z.string().url() });
