import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import MessageBubble from './MessageBubble';
import { Message } from '../../types/chat';

const TestNotification: React.FC = () => {
  const [testMessages, setTestMessages] = React.useState<Message[]>([
    {
      id: '1',
      text: 'This is a normal response from Grace.',
      sender: 'grace',
      timestamp: new Date(),
      metadata: {
        responseStatus: 'Normal situation'
      }
    },
    {
      id: '2',
      text: 'I understand your concern about the cost. Grand Villa offers various pricing options starting at $2,195/month. Now, let me ask about your loved one\'s typical day.',
      sender: 'grace',
      timestamp: new Date(),
      metadata: {
        responseStatus: 'Unexpected situation'
      }
    }
  ]);

  const addNormalMessage = () => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text: 'This is a normal response from Grace.',
      sender: 'grace',
      timestamp: new Date(),
      metadata: {
        responseStatus: 'Normal situation'
      }
    };
    setTestMessages(prev => [...prev, newMessage]);
  };

  const addUnexpectedMessage = () => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text: 'I understand your concern about the cost. Grand Villa offers various pricing options starting at $2,195/month. Now, let me ask about your loved one\'s typical day.',
      sender: 'grace',
      timestamp: new Date(),
      metadata: {
        responseStatus: 'Unexpected situation'
      }
    };
    setTestMessages(prev => [...prev, newMessage]);
  };

  return (
    <Box sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 3, textAlign: 'center' }}>
        Test Notification Component
      </Typography>
      
      <Box sx={{ mb: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
        <Button 
          variant="contained" 
          onClick={addNormalMessage}
          sx={{ background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)' }}
        >
          Add Normal Message
        </Button>
        <Button 
          variant="contained" 
          onClick={addUnexpectedMessage}
          sx={{ background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)' }}
        >
          Add Unexpected Message
        </Button>
      </Box>

      <Box sx={{ 
        background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 249, 250, 0.95) 100%)',
        borderRadius: 2,
        p: 2,
        minHeight: 400
      }}>
        {testMessages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
      </Box>
    </Box>
  );
};

export default TestNotification; 