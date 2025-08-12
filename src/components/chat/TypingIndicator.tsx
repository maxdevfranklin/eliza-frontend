import React from 'react';
import { Box, Fade, Paper, Avatar } from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

interface TypingIndicatorProps {
  isTyping: boolean;
}

const TypingIndicator = React.memo(({ isTyping }: TypingIndicatorProps) => (
  <Fade in={isTyping}>
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-start',
        mb: 3,
        alignItems: 'flex-end',
        gap: 2,
      }}
    >
      <Avatar
        sx={{
          width: 44,
          height: 44,
          background: 'linear-gradient(135deg, #ff6b9d 0%, #6c5ce7 100%)',
          mb: 1,
          boxShadow: '0 4px 20px rgba(255, 107, 157, 0.3)',
        }}
      >
        <SmartToyIcon sx={{ fontSize: 22 }} />
      </Avatar>

      <Paper
        elevation={0}
        sx={{
          p: 3,
          background: '#ffffff',
          borderRadius: '25px 25px 25px 8px',
          border: '1px solid #f1f3f4',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          minWidth: '80px',
        }}
      >
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <FiberManualRecordIcon
            sx={{
              fontSize: 10,
              color: '#ff6b9d',
              animation: 'pulse 1.4s ease-in-out infinite',
              animationDelay: '0s',
            }}
          />
          <FiberManualRecordIcon
            sx={{
              fontSize: 10,
              color: '#ff6b9d',
              animation: 'pulse 1.4s ease-in-out infinite',
              animationDelay: '0.2s',
            }}
          />
          <FiberManualRecordIcon
            sx={{
              fontSize: 10,
              color: '#ff6b9d',
              animation: 'pulse 1.4s ease-in-out infinite',
              animationDelay: '0.4s',
            }}
          />
        </Box>
      </Paper>
    </Box>
  </Fade>
));

export default TypingIndicator; 