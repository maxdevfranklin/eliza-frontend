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
  CssBaseline
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
  id: string;
  agentId: string;
  roomId: string;
  userId: string;
  content: {
    text: string;
  };
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const [agentName, setAgentName] = useState('Grace');
  const [agentId, setAgentId] = useState('01c95267-dd29-02bc-a9ad-d243b05a8d51'); // Set the default agent ID

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        // Fetch history using the agent's UUID directly
        const historyResponse = await fetch(`http://localhost:3000/${agentId}/history`);
        if (!historyResponse.ok) {
          throw new Error('Failed to fetch chat history');
        }
        const history = await historyResponse.json();
        console.log("Received history:", history); // Debug log
        setMessages(history);
      } catch (error) {
        console.error('Error loading chat history:', error);
      }
    };

    loadHistory();
  }, [agentId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    try {
      setIsLoading(true);
      const response = await axios.post(`http://localhost:3000/${agentId}/message`, {
        text: input,
        userId: 'user',
        userName: 'User'
      });

      setMessages(prev => [...prev, ...response.data]);
      setInput('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
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
            <div className="chat-container">
              <div className="messages" ref={messagesEndRef}>
                {messages.map((message, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      justifyContent: message.userId === 'user' ? 'flex-end' : 'flex-start',
                      mb: 2
                    }}
                  >
                    <Paper
                      elevation={1}
                      sx={{
                        p: 2,
                        maxWidth: '70%',
                        bgcolor: message.userId === 'user' ? 'primary.main' : 'white',
                        color: message.userId === 'user' ? 'white' : 'text.primary',
                      }}
                    >
                      <Typography variant="body1">
                        {message.content?.text}
                      </Typography>
                    </Paper>
                  </Box>
                ))}
              </div>
            </div>
          </Box>

          <Box sx={{ p: 2, bgcolor: 'background.paper' }}>
            <form onSubmit={handleSubmit} className="input-area">
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
                disabled={isLoading}
              />
              <Button
                variant="contained"
                color="primary"
                endIcon={<SendIcon />}
                onClick={handleSubmit}
                disabled={isLoading}
              >
                Send
              </Button>
            </form>
          </Box>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}

export default App;