import type { User } from '../domain/User';

export interface UserService {
  listUsers(): Promise<User[]>;
  getUser(id: number): Promise<User>;
  createUser(user: Omit<User, 'id'>): Promise<User>;
  updateUser(id: number, user: Omit<User, 'id'>): Promise<User>;
  deleteUser(id: number): Promise<void>;
}
