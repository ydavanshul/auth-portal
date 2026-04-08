import { Role } from "./role";

export interface User {
  id: string;
  firebaseUid: string;
  email: string;
  name: string | null;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export type CreateUserInput = {
  email: string;
  name?: string;
};

export type UpdateUserInput = {
  name?: string;
  role?: Role;
};
