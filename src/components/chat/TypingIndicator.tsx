import React from 'react';
import { Box, Fade, Paper, Avatar, useMediaQuery, useTheme } from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

interface TypingIndicatorProps {
  isTyping: boolean;
}

const TypingIndicator = React.memo(({ isTyping }: TypingIndicatorProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Fade in={isTyping}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-start',
          mb: { xs: 2, sm: 3 },
          alignItems: 'flex-end',
          gap: { xs: 1, sm: 2 },
        }}
      >
        <Avatar
          sx={{
            width: { xs: 32, sm: 44 },
            height: { xs: 32, sm: 44 },
            background: 'linear-gradient(135deg, #ff6b9d 0%, #6c5ce7 100%)',
            mb: 1,
            boxShadow: '0 4px 20px rgba(255, 107, 157, 0.3)',
            flexShrink: 0,
          }}
        >
          <SmartToyIcon sx={{ fontSize: { xs: 16, sm: 22 } }} />
        </Avatar>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, sm: 3 },
            background: '#ffffff',
            borderRadius: { xs: '20px 20px 20px 6px', sm: '25px 25px 25px 8px' },
            border: '1px solid #f1f3f4',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            minWidth: { xs: '60px', sm: '80px' },
          }}
        >
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <FiberManualRecordIcon
              sx={{
                fontSize: { xs: 8, sm: 10 },
                color: '#ff6b9d',
                animation: 'pulse 1.4s ease-in-out infinite',
                animationDelay: '0s',
              }}
            />
            <FiberManualRecordIcon
              sx={{
                fontSize: { xs: 8, sm: 10 },
                color: '#ff6b9d',
                animation: 'pulse 1.4s ease-in-out infinite',
                animationDelay: '0.2s',
              }}
            />
            <FiberManualRecordIcon
              sx={{
                fontSize: { xs: 8, sm: 10 },
                color: '#ff6b9d',
                animation: 'pulse 1.4s ease-in-out infinite',
                animationDelay: '0.4s',
              }}
            />
          </Box>
        </Paper>
      </Box>
    </Fade>
  );
});

export default TypingIndicator; 