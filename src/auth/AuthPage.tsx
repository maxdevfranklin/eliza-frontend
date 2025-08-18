import React, { useState } from 'react';
import {
  Box,
  Container,
  Fade,
  Slide,
} from '@mui/material';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { ForgotPassword } from './ForgotPassword';

interface AuthPageProps {
  onAuthSuccess: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgot, setIsForgot] = useState(false);

  const switchToRegister = () => {
    setIsLogin(false);
    setIsForgot(false);

  };

  const switchToLogin = () => {
    setIsLogin(true);
    setIsForgot(false);

  };
  const switchToForgot = () => {
    setIsForgot(true);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated background elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: `
            radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.05) 0%, transparent 50%)
          `,
          animation: 'float 20s ease-in-out infinite',
          '@keyframes float': {
            '0%, 100%': {
              transform: 'translateY(0) rotate(0deg)',
            },
            '50%': {
              transform: 'translateY(-20px) rotate(180deg)',
            },
          },
        }}
      />

      {/* Decorative circles */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          right: '10%',
          width: 100,
          height: 100,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
          animation: 'pulse 4s ease-in-out infinite',
          '@keyframes pulse': {
            '0%, 100%': {
              transform: 'scale(1)',
              opacity: 0.1,
            },
            '50%': {
              transform: 'scale(1.1)',
              opacity: 0.2,
            },
          },
        }}
      />

      <Box
        sx={{
          position: 'absolute',
          bottom: '15%',
          left: '15%',
          width: 60,
          height: 60,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.08)',
          animation: 'pulse 6s ease-in-out infinite',
        }}
      />

      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '80vh',
          }}
        >
          <Fade in={true} timeout={600}>
            <Box>
              {isForgot ? (
                <Slide direction="left" in={isForgot} timeout={300}>
                  <Box>
                    <ForgotPassword onBack={switchToLogin} />
                  </Box>
                </Slide>
              ) : isLogin ? (
                <Slide direction="right" in={isLogin} timeout={300}>
                  <Box>
                    <LoginForm
                      onSwitchToRegister={switchToRegister}
                      onLoginSuccess={onAuthSuccess}
                      onForgotPassword={switchToForgot}
                    />
                  </Box>
                </Slide>
              ) : (
                <Slide direction="left" in={!isLogin} timeout={300}>
                  <Box>
                    <RegisterForm
                      onSwitchToLogin={switchToLogin}
                      onRegisterSuccess={onAuthSuccess}
                    />
                  </Box>
                </Slide>
              )}
            </Box>
          </Fade>
        </Box>
      </Container>
    </Box>
  );
};
