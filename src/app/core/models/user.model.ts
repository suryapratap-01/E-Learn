export type Role = 'Learner' | 'Author' | 'Admin';

export interface User {
  id: number;
  name: string;
  email: string;
  username?: string;
  password?: string;
  roles: Role[];
  avatarUrl?: string;
  joinedAt?: string;
  track?: string;
}
