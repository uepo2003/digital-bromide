export interface Bromide {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  serial_number: string | null;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  created_at: string;
  updated_at: string;
}

export interface UserBromide {
  id: string;
  user_id: string;
  bromide_id: string;
  access_token: string;
  is_accessed: boolean;
  accessed_at: string | null;
  created_at: string;
}

export interface UserWithBromide extends User {
  bromides?: (UserBromide & { bromide: Bromide })[];
}

