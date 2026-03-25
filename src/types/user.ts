import type { Role } from './enums';

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone?: string | null;
  profile_image?: string | null;
  role: Role;
  is_verified: boolean;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
  last_login?: string | null;
}
