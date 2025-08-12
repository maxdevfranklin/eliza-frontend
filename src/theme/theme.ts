import { createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#ff6b9d',
      light: '#ff8fab',
      dark: '#e91e63',
    },
    secondary: {
      main: '#6c5ce7',
      light: '#a29bfe',
      dark: '#5f3dc4',
    },
    background: {
      default: '#fafafa',
      paper: '#ffffff',
    },
    text: {
      primary: '#2d3436',
      secondary: '#636e72',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h4: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h5: {
      fontWeight: 600,
      letterSpacing: '-0.025em',
    },
    h6: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    body1: {
      lineHeight: 1.6,
      fontWeight: 400,
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 20,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 25,
          padding: '12px 24px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
            transform: 'translateY(-2px)',
          },
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 25,
            backgroundColor: '#f8f9fa',
            border: 'none',
            '&:hover': {
              backgroundColor: '#e9ecef',
            },
            '&.Mui-focused': {
              backgroundColor: '#ffffff',
              boxShadow: '0 0 0 3px rgba(255, 107, 157, 0.1)',
            },
            '& fieldset': {
              border: '2px solid transparent',
            },
            '&:hover fieldset': {
              border: '2px solid rgba(255, 107, 157, 0.2)',
            },
            '&.Mui-focused fieldset': {
              border: '2px solid #ff6b9d',
            },
          },
        },
      },
    },
  },
});

export default theme; 