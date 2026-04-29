import { describe, it, expect, beforeEach } from 'vitest';
import { userCache } from '../userCache';
import type { User } from '../../domain/User';

describe('userCache', () => {
  beforeEach(() => {
    userCache.setUsers([]);
  });

  it('should store and retrieve users', () => {
    const mockUsers: User[] = [{ id: 1, name: 'João', email: 'joao@email.com', phone: '11999999999', state: 'SP', city: 'São Paulo' }];
    userCache.setUsers(mockUsers);

    expect(userCache.getUsers()).toEqual(mockUsers);
    expect(userCache.getUser(1)).toEqual(mockUsers[0]);
    expect(userCache.getUser('1')).toEqual(mockUsers[0]);
  });

  it('should add a new user', () => {
    userCache.setUsers([]);
    const newUser: User = { id: 2, name: 'Maria', email: 'maria@email.com', phone: '11888888888', state: 'RJ', city: 'Rio de Janeiro' };

    userCache.addUser(newUser);
    expect(userCache.getUsers()).toHaveLength(1);
    expect(userCache.getUser(2)).toEqual(newUser);
  });

  it('should update an existing user', () => {
    const mockUsers: User[] = [{ id: 1, name: 'João', email: 'joao@email.com', phone: '11999999999', state: 'SP', city: 'São Paulo' }];
    userCache.setUsers(mockUsers);
    userCache.updateUser(1, { name: 'João Silva', city: 'Campinas' });

    const updated = userCache.getUser(1);
    expect(updated?.name).toBe('João Silva');
    expect(updated?.city).toBe('Campinas');
    expect(updated?.state).toBe('SP');
  });

  it('should remove a user', () => {
    const mockUsers: User[] = [{ id: 1, name: 'João', email: 'joao@email.com', phone: '11999999999', state: 'SP', city: 'São Paulo' }];
    userCache.setUsers(mockUsers);
    userCache.deleteUser(1);
    expect(userCache.getUsers()).toHaveLength(0);
    expect(userCache.getUser(1)).toBeNull();
  });
});
