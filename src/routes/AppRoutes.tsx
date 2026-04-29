import { Routes, Route, Navigate } from 'react-router-dom';
import { UserListPage } from '../presentation/pages/UserListPage';
import { UserFormPage } from '../presentation/pages/UserFormPage';

export const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/users" replace />} />
    <Route path="/users" element={<UserListPage />} />
    <Route path="/users/new" element={<UserFormPage />} />
    <Route path="/users/:id/edit" element={<UserFormPage />} />
  </Routes>
);
