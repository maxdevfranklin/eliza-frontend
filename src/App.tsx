import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  Container, 
  TextField, 
  Button, 
  Paper, 
  Typography,
  ThemeProvider,
  createTheme,
  CssBaseline,
  LinearProgress,
  Stack
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

interface Message {
  text: string;
  sender: 'user' | 'grace';
  timestamp: Date;
}

type DialogStep = 'trust_building' | 'situation_discovery' | 'lifestyle_discovery' | 
                 'readiness_discovery' | 'priorities_discovery' | 'needs_matching' | 
                 'visit_transition';

const dialogSteps: DialogStep[] = [
  'trust_building',
  'situation_discovery',
  'lifestyle_discovery',
  'readiness_discovery',
  'priorities_discovery',
  'needs_matching',
  'visit_transition'
];

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<DialogStep>('situation_discovery');
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // const response = await axios.post('http://localhost:3000/01c95267-dd29-02bc-a9ad-d243b05a8d51/message', {
      const response = await axios.post('https://eliza-backend-production-4791.up.railway.app/01c95267-dd29-02bc-a9ad-d243b05a8d51/message', {
        text: input,
        userId: "user",
        userName: "User"
      });

      // Create separate messages for each response
      response.data.forEach((item: any) => {
        const graceMessage: Message = {
          text: item.text,
          sender: 'grace',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, graceMessage]);
      });
      
      // Update dialog step based on the last response's metadata
      const lastResponse = response.data[response.data.length - 1];
      if (lastResponse.metadata?.stage && dialogSteps.includes(lastResponse.metadata.stage)) {
        console.log('Updating stage to:', lastResponse.metadata.stage);
        setCurrentStep(lastResponse.metadata.stage);
      } else {
        console.log('No valid stage found in metadata:', lastResponse.metadata);
      } 
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'grace',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const getStepProgress = () => {
    const currentIndex = dialogSteps.indexOf(currentStep);
    return ((currentIndex + 1) / dialogSteps.length) * 100;
  };

  const formatStepName = (step: string) => {
    return step.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ height: '100vh', py: 2 }}>
        <Paper 
          elevation={3} 
          sx={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column',
            bgcolor: '#f5f5f5'
          }}
        >
          <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
            <Typography variant="h5" component="h1">
              ElizaOS
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                {formatStepName(currentStep)}
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={getStepProgress()} 
                sx={{ 
                  height: 8, 
                  borderRadius: 4,
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4,
                    bgcolor: 'white'
                  }
                }} 
              />
              <Stack 
                direction="row" 
                spacing={1} 
                sx={{ 
                  mt: 1, 
                  justifyContent: 'space-between',
                  fontSize: '0.7rem',
                  opacity: 0.8
                }}
              >
                {dialogSteps.map((step, index) => (
                  <Typography 
                    key={step} 
                    variant="caption"
                    sx={{
                      color: dialogSteps.indexOf(currentStep) >= index ? 'white' : 'rgba(255, 255, 255, 0.5)',
                      fontWeight: currentStep === step ? 'bold' : 'normal'
                    }}
                  >
                    {formatStepName(step)}
                  </Typography>
                ))}
              </Stack>
            </Box>
          </Box>

          <Box 
            sx={{ 
              flex: 1, 
              overflow: 'auto', 
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 2
            }}
          >
            {messages.map((message, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    maxWidth: '70%',
                    bgcolor: message.sender === 'user' ? 'primary.main' : 'white',
                    color: message.sender === 'user' ? 'white' : 'text.primary',
                  }}
                >
                  <Typography variant="body1">{message.text}</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.7 }}>
                    {message.timestamp.toLocaleTimeString()}
                  </Typography>
                </Paper>
              </Box>
            ))}
            <div ref={messagesEndRef} />
          </Box>

          <Box sx={{ p: 2, bgcolor: 'background.paper' }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                disabled={isLoading}
              />
              <Button
                variant="contained"
                color="primary"
                endIcon={<SendIcon />}
                onClick={handleSend}
                disabled={isLoading}
              >
                Send
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}

export default App;