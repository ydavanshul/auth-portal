import { Role } from "@monorepo/shared-types";

declare global {
  namespace Express {
    interface Request {
      csrfToken?: string;
      user?: {
        id: string;
        firebaseUid: string;
        email: string;
        role: Role;
      };
    }
  }
}

export {};
