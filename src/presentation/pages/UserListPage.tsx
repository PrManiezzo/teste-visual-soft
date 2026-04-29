import React, { useMemo, useState } from 'react';
import { useUsers } from '../hooks/useUsers';
import { SearchBar } from '../components/SearchBar';
import { Button } from '../components/Button';
import { Link, useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { useToast } from '../hooks/useToast';
import { Modal } from '../components/Modal';

export const UserListPage: React.FC = () => {
  const { users, loading, error, deleteUser } = useUsers();
  const [search, setSearch] = useState('');
  const { addToast } = useToast();
  const navigate = useNavigate();
  
  const [userToDelete, setUserToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;
    setIsDeleting(true);
    try {
      await deleteUser(userToDelete);
      addToast('Usuário apagado com sucesso!', 'success');
    } catch {
      addToast('Erro ao apagar o usuário.', 'error');
    } finally {
      setIsDeleting(false);
      setUserToDelete(null);
    }
  };

  const filteredUsers = useMemo(
    () =>
      users.filter(
        (u) =>
          (u.name?.toLowerCase() || '').includes(search.toLowerCase()) ||
          (u.email?.toLowerCase() || '').includes(search.toLowerCase()) ||
          (u.city?.toLowerCase() || '').includes(search.toLowerCase()) ||
          (u.state?.toLowerCase() || '').includes(search.toLowerCase())
      ),
    [users, search]
  );

  React.useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  
  const currentUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(start, start + itemsPerPage);
  }, [filteredUsers, currentPage, itemsPerPage]);

  return (
    <Layout>
      <div className="page-header">
        <h2 className="page-title">Usuários</h2>
        <Link to="/users/new">
          <Button>Adicionar Usuário</Button>
        </Link>
      </div>

      <SearchBar value={search} onChange={setSearch} placeholder="Buscar por nome, email ou cidade..." />

      {loading && <div className="state-message">Carregando...</div>}
      {error && (
        <div className="state-error">
          <strong>Erro:</strong> {error}
        </div>
      )}
      {!loading && !error && filteredUsers.length === 0 && (
        <div className="state-message">Nenhum usuário encontrado.</div>
      )}

      {!loading && !error && filteredUsers.length > 0 && (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Telefone</th>
                <th>Estado</th>
                <th>Cidade</th>
                <th style={{ textAlign: 'center' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user) => (
                <tr 
                  key={user.id} 
                  onDoubleClick={() => navigate(`/users/${user.id}/edit`)} 
                  style={{ cursor: 'pointer' }}
                  title="Duplo clique para editar"
                >
                  <td className="truncate-cell name-cell">{user.name}</td>
                  <td className="truncate-cell email-cell">{user.email}</td>
                  <td className="truncate-cell phone-cell">{user.phone}</td>
                  <td className="truncate-cell state-cell">{user.city && user.city.includes('|') ? user.city.split('|')[0] : user.state}</td>
                  <td className="truncate-cell city-cell">{user.city && user.city.includes('|') ? user.city.split('|')[1] : user.city}</td>
                  <td className="table-actions">
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                      <Link to={`/users/${user.id}/edit`}>
                        <Button variant="secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}>Editar</Button>
                      </Link>
                      <Button 
                        onClick={() => setUserToDelete(user.id)}
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', backgroundColor: 'var(--danger)', color: '#fff' }}
                      >
                        Deletar
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && !error && filteredUsers.length > 0 && totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem', alignItems: 'center' }}>
          <Button 
            variant="secondary" 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.875rem' }}
          >
            Anterior
          </Button>
          <span>Página {currentPage} de {totalPages}</span>
          <Button 
            variant="secondary" 
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.875rem' }}
          >
            Próxima
          </Button>
        </div>
      )}

      <Modal 
        isOpen={userToDelete !== null}
        title="Apagar Usuário"
        message="Tem certeza que deseja apagar este usuário? Esta ação não pode ser desfeita."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setUserToDelete(null)}
        confirmText="Sim, Apagar"
        isDanger={true}
        isLoading={isDeleting}
      />
    </Layout>
  );
};