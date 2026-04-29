import { useCallback, useEffect, useState } from 'react';
import { userApi } from '../../infrastructure/userApi';
import type { User } from '../../domain/User';
import { userCache } from '../../application/userCache';

export function useUsers() {
  const [users, setUsers] = useState<User[]>(userCache.getUsers() || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async (forceReload = false) => {
    if (!forceReload && userCache.getUsers() !== null) {
      setUsers(userCache.getUsers()!);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await userApi.listUsers();
      const fetchedUsers = Array.isArray(data) ? data : [];
      userCache.setUsers(fetchedUsers);
      setUsers(fetchedUsers);
    } catch (e) {
      const err = e as { response?: { data?: { message?: string } } };
      if (err?.response?.data?.message) {
        setError(err.response.data.message);
      } else if (e instanceof Error) {
        setError(e.message || 'Erro ao carregar usuários');
      } else {
        setError('Erro ao carregar usuários');
      }
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const createUser = useCallback(async (user: Omit<User, 'id'>) => {
    setLoading(true);
    setError(null);
    try {
      const newUser = await userApi.createUser(user);
      userCache.addUser(newUser);
      setUsers(userCache.getUsers()!);
      return newUser;
    } catch (e) {
      const err = e as { response?: { data?: { message?: string } } };
      if (err?.response?.data?.message) {
        setError(err.response.data.message);
      } else if (e instanceof Error) {
        setError(e.message || 'Erro ao criar usuário');
      } else {
        setError('Erro ao criar usuário');
      }
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUser = useCallback(async (id: number | string, user: Omit<User, 'id'>) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await userApi.updateUser(Number(id), user);
      
      // Força a atualização do cache com os dados que enviamos (user).
      // Isso previne que a API retorne apenas uma mensagem de sucesso ou um objeto desatualizado
      // e acabe mantendo a cidade/estado antigos na tela de listagem.
      userCache.updateUser(id, user as any);
      
      setUsers(userCache.getUsers()!);
      return updated;
    } catch (e) {
      const err = e as { response?: { data?: { message?: string } } };
      if (err?.response?.data?.message) {
        setError(err.response.data.message);
      } else if (e instanceof Error) {
        setError(e.message || 'Erro ao atualizar usuário');
      } else {
        setError('Erro ao atualizar usuário');
      }
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteUser = useCallback(async (id: number | string) => {
    setLoading(true);
    setError(null);
    try {
      await userApi.deleteUser(Number(id));
      userCache.deleteUser(id);
      setUsers(userCache.getUsers()!);
    } catch (e) {
      const err = e as { response?: { data?: { message?: string } } };
      if (err?.response?.data?.message) {
        setError(err.response.data.message);
      } else if (e instanceof Error) {
        setError(e.message || 'Erro ao remover usuário');
      } else {
        setError('Erro ao remover usuário');
      }
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const getUser = useCallback(async (id: number | string) => {
    const cached = userCache.getUser(id);
    if (cached) return cached;
    
    
    return await userApi.getUser(Number(id));
  }, []);

  useEffect(() => {
    (async () => {
      await fetchUsers(false); // Busca da API apenas se o cache estiver vazio
    })();
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    refetch: fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    getUser,
  };
}
