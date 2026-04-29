import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes/AppRoutes';
import { ToastProvider } from './presentation/hooks/useToast';
import { ToastContainer } from './presentation/components/Toast';

const App: React.FC = () => (
  <ToastProvider>
    <BrowserRouter>
      <AppRoutes />
      <ToastContainer />
    </BrowserRouter>
  </ToastProvider>
);

export default App;
