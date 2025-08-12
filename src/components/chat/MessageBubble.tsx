import React from 'react';
import { Box, Paper, Typography, Avatar } from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import { Message } from '../../types/chat';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble = React.memo(({ message }: MessageBubbleProps) => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
      mb: 3,
      alignItems: 'flex-end',
      gap: 2,
    }}
  >
    {message.sender === 'grace' && (
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
    )}

    <Box sx={{ maxWidth: '70%', minWidth: '120px' }}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          background: message.sender === 'user'
            ? 'linear-gradient(135deg, #ff6b9d 0%, #ff8fab 100%)'
            : '#ffffff',
          color: message.sender === 'user' ? 'white' : 'text.primary',
          borderRadius: message.sender === 'user' ? '25px 25px 8px 25px' : '25px 25px 25px 8px',
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
            fontSize: '1rem',
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
            mt: 1,
            fontSize: '0.75rem',
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
          width: 44,
          height: 44,
          background: 'linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)',
          mb: 1,
          boxShadow: '0 4px 20px rgba(108, 92, 231, 0.3)',
        }}
      >
        <PersonIcon sx={{ fontSize: 22 }} />
      </Avatar>
    )}
  </Box>
));

export default MessageBubble; 