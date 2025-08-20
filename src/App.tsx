import React, { useState } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme/theme';
import { AuthProvider, useAuth } from './auth/AuthContext';
import { AuthPage } from './auth/AuthPage';
import AuthenticatedApp from './pages/AuthenticatedApp';

function AppContent({ onShowAuth, showAuth, onAuthSuccess }: { onShowAuth: () => void; showAuth: boolean; onAuthSuccess: () => void }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated || showAuth) {
    return <AuthPage onAuthSuccess={onAuthSuccess} />;
  }
  return <AuthenticatedApp />;
}

function App() {
  const [showAuth, setShowAuth] = useState(false);

  const handleAuthSuccess = () => {
    setShowAuth(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <AppContent onShowAuth={() => setShowAuth(true)} showAuth={showAuth} onAuthSuccess={handleAuthSuccess} />
      </AuthProvider>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        
        * {
          box-sizing: border-box;
        }
        
        body {
          margin: 0;
          padding: 0;
          font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          overflow-x: hidden;
        }
        
        @keyframes pulse {
          0%, 70%, 100% { opacity: 0.4; transform: scale(1); }
          35% { opacity: 1; transform: scale(1.2); }
        }
        
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        /* Mobile-specific optimizations */
        @media (max-width: 768px) {
          body {
            font-size: 14px;
          }
          
          /* Prevent zoom on input focus on iOS */
          input, textarea, select {
            font-size: 16px !important;
          }
          
          /* Improve touch targets */
          button, [role="button"] {
            min-height: 44px;
            min-width: 44px;
          }
        }
        
        /* Ensure proper viewport handling */
        #root {
          min-height: 100vh;
          width: 100%;
        }
      `}</style>
    </ThemeProvider>
  );
}

export default App;