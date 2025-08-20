import React from 'react';
import { Box, Paper, Typography, Avatar, useMediaQuery, useTheme } from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import { Message } from '../../types/chat';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble = React.memo(({ message }: MessageBubbleProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('xs'));

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
        mb: { xs: 2, sm: 3 },
        alignItems: 'flex-end',
        gap: { xs: 1, sm: 2 },
      }}
    >
      {message.sender === 'grace' && (
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
      )}

      <Box sx={{ 
        maxWidth: { xs: '85%', sm: '70%' }, 
        minWidth: { xs: '80px', sm: '120px' },
        flex: 1,
      }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, sm: 3 },
            background: message.sender === 'user'
              ? 'linear-gradient(135deg, #ff6b9d 0%, #ff8fab 100%)'
              : '#ffffff',
            color: message.sender === 'user' ? 'white' : 'text.primary',
            borderRadius: message.sender === 'user' 
              ? { xs: '20px 20px 6px 20px', sm: '25px 25px 8px 25px' }
              : { xs: '20px 20px 20px 6px', sm: '25px 25px 25px 8px' },
            border: message.sender === 'grace' ? '1px solid #f1f3f4' : 'none',
            boxShadow: message.sender === 'user'
              ? '0 8px 32px rgba(255, 107, 157, 0.3)'
              : '0 4px 20px rgba(0, 0, 0, 0.08)',
            position: 'relative',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: '0.9rem', sm: '1rem' },
              lineHeight: 1.6,
              wordBreak: 'break-word',
              fontWeight: 400,
            }}
          >
            {message.text}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              opacity: 0.7,
              display: 'block',
              mt: { xs: 0.5, sm: 1 },
              fontSize: { xs: '0.65rem', sm: '0.75rem' },
              fontWeight: 500,
            }}
          >
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Typography>
        </Paper>
      </Box>

      {message.sender === 'user' && (
        <Avatar
          sx={{
            width: { xs: 32, sm: 44 },
            height: { xs: 32, sm: 44 },
            background: 'linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)',
            mb: 1,
            boxShadow: '0 4px 20px rgba(108, 92, 231, 0.3)',
            flexShrink: 0,
          }}
        >
          <PersonIcon sx={{ fontSize: { xs: 16, sm: 22 } }} />
        </Avatar>
      )}
    </Box>
  );
});

export default MessageBubble; 