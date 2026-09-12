import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { ProgressProvider } from './context/ProgressContext';
import AppRoutes from './routes/AppRoutes';
import AuthModal from './components/auth/AuthModal';
import TrialExpiredGate from './components/auth/TrialExpiredGate';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <ProgressProvider>
            <AppRoutes />
            <AuthModal />
            <TrialExpiredGate />
          </ProgressProvider>
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
