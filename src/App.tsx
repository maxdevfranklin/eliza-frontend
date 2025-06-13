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
  Stack,
  Avatar,
  Chip,
  IconButton,
  Fade,
  Slide,
  useMediaQuery
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import axios from 'axios';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#667eea',
      light: '#764ba2',
      dark: '#4c63d2',
    },
    secondary: {
      main: '#f093fb',
      light: '#f5576c',
      dark: '#c471ed',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#1a202c',
      secondary: '#718096',
    },
  },
  typography: {
    fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h5: {
      fontWeight: 600,
      letterSpacing: '-0.025em',
    },
    body1: {
      lineHeight: 1.6,
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 12,
          padding: '10px 20px',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 24,
            backgroundColor: '#f7fafc',
            border: 'none',
            '&:hover': {
              backgroundColor: '#edf2f7',
            },
            '&.Mui-focused': {
              backgroundColor: '#ffffff',
              boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)',
            },
            '& fieldset': {
              border: '1px solid #e2e8f0',
            },
            '&:hover fieldset': {
              border: '1px solid #cbd5e0',
            },
            '&.Mui-focused fieldset': {
              border: '2px solid #667eea',
            },
          },
        },
      },
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

const stepLabels = {
  trust_building: 'Building Trust',
  situation_discovery: 'Understanding You',
  lifestyle_discovery: 'Your Lifestyle',
  readiness_discovery: 'Your Readiness',
  priorities_discovery: 'Your Priorities',
  needs_matching: 'Finding Matches',
  visit_transition: 'Next Steps'
};

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hello! I'm Grace, your personal fashion consultant. I'm here to help you discover your perfect style. Let's start by getting to know each other better. What brings you here today?",
      sender: 'grace',
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<DialogStep>('situation_discovery');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateTyping = () => {
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 1500);
  };

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
    simulateTyping();

    try {
      const response = await axios.post('https://eliza-backend-production-4791.up.railway.app/01c95267-dd29-02bc-a9ad-d243b05a8d51/message', {
        text: input,
        userId: "user",
        userName: "User"
      });

      setTimeout(() => {
        response.data.forEach((item: any, index: number) => {
          setTimeout(() => {
            const graceMessage: Message = {
              text: item.text,
              sender: 'grace',
              timestamp: new Date(),
            };
            setMessages(prev => [...prev, graceMessage]);
          }, index * 800);
        });
        
        const lastResponse = response.data[response.data.length - 1];
        if (lastResponse.metadata?.stage && dialogSteps.includes(lastResponse.metadata.stage)) {
          setCurrentStep(lastResponse.metadata.stage);
        }
      }, 1000);
      
    } catch (error) {
      console.error('Error sending message:', error);
      setTimeout(() => {
        const errorMessage: Message = {
          text: 'Sorry, I encountered an error. Please try again.',
          sender: 'grace',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, errorMessage]);
      }, 1000);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
        setIsTyping(false);
      }, 1000);
    }
  };

  const getStepProgress = () => {
    const currentIndex = dialogSteps.indexOf(currentStep);
    return ((currentIndex + 1) / dialogSteps.length) * 100;
  };

  const MessageBubble = ({ message, index }: { message: Message; index: number }) => (
    <Slide direction={message.sender === 'user' ? 'left' : 'right'} in={true} timeout={300 + index * 100}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
          mb: 2,
          alignItems: 'flex-end',
          gap: 1,
        }}
      >
        {message.sender === 'grace' && (
          <Avatar
            sx={{
              width: 32,
              height: 32,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              mb: 0.5,
            }}
          >
            <SmartToyIcon sx={{ fontSize: 18 }} />
          </Avatar>
        )}
        
        <Box sx={{ maxWidth: '75%', minWidth: '120px' }}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              background: message.sender === 'user' 
                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                : '#ffffff',
              color: message.sender === 'user' ? 'white' : 'text.primary',
              borderRadius: message.sender === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
              border: message.sender === 'grace' ? '1px solid #e2e8f0' : 'none',
              boxShadow: message.sender === 'user' 
                ? '0 4px 20px rgba(102, 126, 234, 0.3)'
                : '0 2px 10px rgba(0, 0, 0, 0.05)',
              position: 'relative',
              '&::before': message.sender === 'grace' ? {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: -8,
                width: 0,
                height: 0,
                borderLeft: '8px solid transparent',
                borderRight: '8px solid #ffffff',
                borderTop: '8px solid #ffffff',
                borderBottom: '8px solid transparent',
              } : {},
            }}
          >
            <Typography 
              variant="body1" 
              sx={{ 
                fontSize: '0.95rem',
                lineHeight: 1.5,
                wordBreak: 'break-word',
              }}
            >
              {message.text}
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                opacity: 0.7,
                display: 'block',
                mt: 0.5,
                fontSize: '0.7rem',
              }}
            >
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Typography>
          </Paper>
        </Box>

        {message.sender === 'user' && (
          <Avatar
            sx={{
              width: 32,
              height: 32,
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              mb: 0.5,
            }}
          >
            <PersonIcon sx={{ fontSize: 18 }} />
          </Avatar>
        )}
      </Box>
    </Slide>
  );

  const TypingIndicator = () => (
    <Fade in={isTyping}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-start',
          mb: 2,
          alignItems: 'flex-end',
          gap: 1,
        }}
      >
        <Avatar
          sx={{
            width: 32,
            height: 32,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            mb: 0.5,
          }}
        >
          <SmartToyIcon sx={{ fontSize: 18 }} />
        </Avatar>
        
        <Paper
          elevation={0}
          sx={{
            p: 2,
            background: '#ffffff',
            borderRadius: '20px 20px 20px 4px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
            minWidth: '60px',
          }}
        >
          <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
            <FiberManualRecordIcon 
              sx={{ 
                fontSize: 8, 
                color: '#cbd5e0',
                animation: 'pulse 1.4s ease-in-out infinite',
                animationDelay: '0s',
              }} 
            />
            <FiberManualRecordIcon 
              sx={{ 
                fontSize: 8, 
                color: '#cbd5e0',
                animation: 'pulse 1.4s ease-in-out infinite',
                animationDelay: '0.2s',
              }} 
            />
            <FiberManualRecordIcon 
              sx={{ 
                fontSize: 8, 
                color: '#cbd5e0',
                animation: 'pulse 1.4s ease-in-out infinite',
                animationDelay: '0.4s',
              }} 
            />
          </Box>
        </Paper>
      </Box>
    </Fade>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: isMobile ? 1 : 2,
        }}
      >
        <Container maxWidth="md" sx={{ height: isMobile ? '100vh' : '90vh' }}>
          <Paper 
            elevation={24}
            sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              borderRadius: isMobile ? 0 : 3,
              overflow: 'hidden',
              backdropFilter: 'blur(20px)',
              background: 'rgba(255, 255, 255, 0.95)',
            }}
          >
            {/* Header */}
            <Box 
              sx={{ 
                p: 3,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '1px',
                  background: 'rgba(255, 255, 255, 0.2)',
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar
                    sx={{
                      width: 48,
                      height: 48,
                      background: 'rgba(255, 255, 255, 0.2)',
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    <SmartToyIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" component="h1" sx={{ fontWeight: 700 }}>
                      Grace
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9, fontSize: '0.85rem' }}>
                      Fashion Consultant • Online
                    </Typography>
                  </Box>
                </Box>
                <IconButton sx={{ color: 'white' }}>
                  <MoreVertIcon />
                </IconButton>
              </Box>

              {/* Progress Section */}
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {stepLabels[currentStep]}
                  </Typography>
                  <Chip
                    label={`${Math.round(getStepProgress())}%`}
                    size="small"
                    sx={{
                      background: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '0.75rem',
                    }}
                  />
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={getStepProgress()} 
                  sx={{ 
                    height: 6, 
                    borderRadius: 3,
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 3,
                      background: 'linear-gradient(90deg, #ffffff 0%, rgba(255, 255, 255, 0.8) 100%)',
                    }
                  }} 
                />
              </Box>
            </Box>

            {/* Messages Area */}
            <Box 
              sx={{ 
                flex: 1, 
                overflow: 'auto', 
                p: 3,
                background: '#f8fafc',
                '&::-webkit-scrollbar': {
                  width: '6px',
                },
                '&::-webkit-scrollbar-track': {
                  background: 'transparent',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: '#cbd5e0',
                  borderRadius: '3px',
                },
                '&::-webkit-scrollbar-thumb:hover': {
                  background: '#a0aec0',
                },
              }}
            >
              {messages.map((message, index) => (
                <MessageBubble key={index} message={message} index={index} />
              ))}
              {isTyping && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </Box>

            {/* Input Area */}
            <Box 
              sx={{ 
                p: 3, 
                background: '#ffffff',
                borderTop: '1px solid #e2e8f0',
              }}
            >
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Type your message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                  disabled={isLoading}
                  multiline
                  maxRows={4}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      minHeight: '48px',
                      alignItems: 'flex-end',
                      pb: 1,
                    },
                  }}
                />
                <Button
                  variant="contained"
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  sx={{
                    minWidth: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 6px 25px rgba(102, 126, 234, 0.4)',
                    },
                    '&:disabled': {
                      background: '#e2e8f0',
                      color: '#a0aec0',
                    },
                    transition: 'all 0.2s ease-in-out',
                  }}
                >
                  <SendIcon />
                </Button>
              </Box>
            </Box>
          </Paper>
        </Container>
      </Box>

      <style>
        {`
          @keyframes pulse {
            0%, 70%, 100% {
              opacity: 0.4;
              transform: scale(1);
            }
            35% {
              opacity: 1;
              transform: scale(1.1);
            }
          }
        `}
      </style>
    </ThemeProvider>
  );
}

export default App;