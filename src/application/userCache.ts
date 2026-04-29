import type { User } from '../domain/User';

class UserCache {
  private users: User[] | null = null;

  setUsers(users: User[]) {
    this.users = users;
  }

  getUsers(): User[] | null {
    return this.users;
  }

  getUser(id: number | string): User | null {
    if (!this.users) return null;
    return this.users.find(u => String(u.id) === String(id)) || null;
  }

  addUser(user: User) {
    if (!this.users) this.users = [];
    this.users.push(user);
  }

  updateUser(id: number | string, data: Partial<User>) {
    if (!this.users) return;
    this.users = this.users.map(u => String(u.id) === String(id) ? { ...u, ...data } : u);
  }

  deleteUser(id: number | string) {
    if (!this.users) return;
    this.users = this.users.filter(u => String(u.id) !== String(id));
  }

  clear() {
    this.users = null;
  }
}

export const userCache = new UserCache();
