import React from 'react';
import { useTheme } from '../hooks/useTheme';
import { Button } from './Button';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme, toggleTheme } = useTheme();
  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-header-title">Usuários</h1>
        <Button
          type="button"
          variant="secondary"
          onClick={toggleTheme}
        >
          {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
        </Button>
      </header>
      <main className="app-main">
        <div className="app-content">
          {children}
        </div>
      </main>
    </div>
  );
};
