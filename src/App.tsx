import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Badge,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import MenuIcon from '@mui/icons-material/Menu';
import StyleIcon from '@mui/icons-material/Style';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PaletteIcon from '@mui/icons-material/Palette';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import FavoriteIcon from '@mui/icons-material/Favorite';
import StarIcon from '@mui/icons-material/Star';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import MicIcon from '@mui/icons-material/Mic';
import ImageIcon from '@mui/icons-material/Image';
import axios from 'axios';

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

interface Message {
  id: string;
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

const sidebarItems = [
  { icon: <StyleIcon />, text: 'Style Analysis', badge: '3' },
  { icon: <TrendingUpIcon />, text: 'Trending Now', badge: null },
  { icon: <PaletteIcon />, text: 'Color Palette', badge: null },
  { icon: <ShoppingBagIcon />, text: 'Shopping List', badge: '12' },
  { icon: <FavoriteIcon />, text: 'Favorites', badge: '8' },
];

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'initial',
      text: "Hello! I'm Grace, your personal fashion consultant. I'm here to help you discover your perfect style and create looks that make you feel absolutely amazing. Let's start this exciting journey together! ✨",
      sender: 'grace',
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<DialogStep>('situation_discovery');
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages.length, scrollToBottom]);

  const generateMessageId = () => {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleSend = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: generateMessageId(),
      text: input.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    // Add user message immediately
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input.trim();
    setInput('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      const response = await axios.post('https://eliza-backend-production-4791.up.railway.app/01c95267-dd29-02bc-a9ad-d243b05a8d51/message', {
        text: currentInput,
        userId: "user",
        userName: "User"
      });

      // Stop typing indicator
      setIsTyping(false);

      // Process response data
      if (response.data && Array.isArray(response.data)) {
        // Add all Grace messages at once to prevent continuous updates
        const graceMessages: Message[] = response.data.map((item: any, index: number) => ({
          id: generateMessageId(),
          text: item.text || 'Sorry, I encountered an error processing your message.',
          sender: 'grace' as const,
          timestamp: new Date(Date.now() + index * 100), // Slight delay for ordering
        }));

        // Add all messages at once
        setMessages(prev => [...prev, ...graceMessages]);

        // Update step if provided
        const lastResponse = response.data[response.data.length - 1];
        if (lastResponse?.metadata?.stage && dialogSteps.includes(lastResponse.metadata.stage)) {
          setCurrentStep(lastResponse.metadata.stage);
        }
      } else {
        // Handle single response or error
        const graceMessage: Message = {
          id: generateMessageId(),
          text: response.data?.text || 'Sorry, I encountered an error processing your message.',
          sender: 'grace',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, graceMessage]);
      }
      
    } catch (error) {
      console.error('Error sending message:', error);
      setIsTyping(false);
      
      const errorMessage: Message = {
        id: generateMessageId(),
        text: 'Sorry, I encountered a connection error. Please try again.',
        sender: 'grace',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  }, [input, isLoading]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  const getStepProgress = useCallback(() => {
    const currentIndex = dialogSteps.indexOf(currentStep);
    return ((currentIndex + 1) / dialogSteps.length) * 100;
  }, [currentStep]);

  // Removed animations and memoized properly
  const MessageBubble = React.memo(({ message }: { message: Message }) => (
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

  const TypingIndicator = React.memo(() => (
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

  const Sidebar = () => (
    <Box
      sx={{
        width: 320,
        height: '100%',
        background: 'linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)',
        borderRight: '1px solid #e9ecef',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Sidebar Header */}
      <Box sx={{ p: 3, borderBottom: '1px solid #e9ecef' }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#2d3436', mb: 1 }}>
          Fashion Studio
        </Typography>
        <Typography variant="body2" sx={{ color: '#636e72' }}>
          Your personal style journey
        </Typography>
      </Box>

      {/* Navigation */}
      <List sx={{ flex: 1, p: 2 }}>
        {sidebarItems.map((item, index) => (
          <ListItem
            key={index}
            sx={{
              borderRadius: 2,
              mb: 1,
              '&:hover': {
                backgroundColor: 'rgba(255, 107, 157, 0.08)',
                transform: 'translateX(4px)',
              },
              transition: 'all 0.2s ease',
              cursor: 'pointer',
            }}
          >
            <ListItemIcon sx={{ color: '#ff6b9d', minWidth: 40 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text}
              primaryTypographyProps={{
                fontWeight: 500,
                fontSize: '0.95rem',
              }}
            />
            {item.badge && (
              <Chip
                label={item.badge}
                size="small"
                sx={{
                  backgroundColor: '#ff6b9d',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  height: 20,
                }}
              />
            )}
          </ListItem>
        ))}
      </List>

      <Divider />

      {/* Style Stats */}
      <Box sx={{ p: 3 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#2d3436' }}>
          Your Style Progress
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Card sx={{ textAlign: 'center', p: 2, backgroundColor: '#fff5f8' }}>
              <StarIcon sx={{ color: '#ff6b9d', mb: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#2d3436' }}>
                4.8
              </Typography>
              <Typography variant="caption" sx={{ color: '#636e72' }}>
                Style Score
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={6}>
            <Card sx={{ textAlign: 'center', p: 2, backgroundColor: '#f0f0ff' }}>
              <ShoppingBagIcon sx={{ color: '#6c5ce7', mb: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#2d3436' }}>
                23
              </Typography>
              <Typography variant="caption" sx={{ color: '#636e72' }}>
                Outfits
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          height: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          overflow: 'hidden',
        }}
      >
        {/* Sidebar for Desktop */}
        {!isMobile && <Sidebar />}

        {/* Mobile Drawer */}
        <Drawer
          anchor="left"
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              width: 320,
            },
          }}
        >
          <Sidebar />
        </Drawer>

        {/* Main Chat Area */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Header */}
          <Box 
            sx={{ 
              p: 3,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              {isMobile && (
                <IconButton 
                  onClick={() => setSidebarOpen(true)}
                  sx={{ color: '#2d3436' }}
                >
                  <MenuIcon />
                </IconButton>
              )}
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        backgroundColor: '#00b894',
                        border: '2px solid white',
                      }}
                    />
                  }
                >
                  <Avatar
                    sx={{
                      width: 56,
                      height: 56,
                      background: 'linear-gradient(135deg, #ff6b9d 0%, #6c5ce7 100%)',
                      boxShadow: '0 8px 32px rgba(255, 107, 157, 0.3)',
                    }}
                  >
                    <SmartToyIcon sx={{ fontSize: 28 }} />
                  </Avatar>
                </Badge>
                
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#2d3436', mb: 0.5 }}>
                    Grace
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#636e72', fontSize: '0.9rem' }}>
                    Fashion Consultant • Online
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Chip
                label={`${Math.round(getStepProgress())}% Complete`}
                sx={{
                  background: 'linear-gradient(135deg, #ff6b9d 0%, #6c5ce7 100%)',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                }}
              />
              <IconButton sx={{ color: '#636e72' }}>
                <MoreVertIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Progress Bar */}
          <Box sx={{ px: 3, py: 2, background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(20px)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#2d3436' }}>
                {stepLabels[currentStep]}
              </Typography>
              <Typography variant="body2" sx={{ color: '#636e72' }}>
                Step {dialogSteps.indexOf(currentStep) + 1} of {dialogSteps.length}
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={getStepProgress()} 
              sx={{ 
                height: 8, 
                borderRadius: 4,
                bgcolor: 'rgba(255, 107, 157, 0.1)',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                  background: 'linear-gradient(90deg, #ff6b9d 0%, #6c5ce7 100%)',
                }
              }} 
            />
          </Box>

          {/* Messages Area */}
          <Box 
            sx={{ 
              flex: 1, 
              overflow: 'auto', 
              p: 4,
              background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 249, 250, 0.95) 100%)',
              backdropFilter: 'blur(20px)',
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-track': {
                background: 'transparent',
              },
              '&::-webkit-scrollbar-thumb': {
                background: 'rgba(255, 107, 157, 0.3)',
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb:hover': {
                background: 'rgba(255, 107, 157, 0.5)',
              },
            }}
          >
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </Box>

          {/* Input Area */}
          <Box 
            sx={{ 
              p: 3, 
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              borderTop: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end', mb: 2 }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton 
                  size="small" 
                  sx={{ 
                    color: '#636e72',
                    '&:hover': { color: '#ff6b9d', backgroundColor: 'rgba(255, 107, 157, 0.1)' }
                  }}
                >
                  <AttachFileIcon />
                </IconButton>
                <IconButton 
                  size="small" 
                  sx={{ 
                    color: '#636e72',
                    '&:hover': { color: '#ff6b9d', backgroundColor: 'rgba(255, 107, 157, 0.1)' }
                  }}
                >
                  <ImageIcon />
                </IconButton>
                <IconButton 
                  size="small" 
                  sx={{ 
                    color: '#636e72',
                    '&:hover': { color: '#ff6b9d', backgroundColor: 'rgba(255, 107, 157, 0.1)' }
                  }}
                >
                  <EmojiEmotionsIcon />
                </IconButton>
              </Box>
              
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Share your style thoughts..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                multiline
                maxRows={4}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    minHeight: '56px',
                    alignItems: 'flex-end',
                    pb: 1.5,
                    fontSize: '1rem',
                  },
                }}
              />
              
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton 
                  sx={{ 
                    color: '#636e72',
                    '&:hover': { color: '#ff6b9d', backgroundColor: 'rgba(255, 107, 157, 0.1)' }
                  }}
                >
                  <MicIcon />
                </IconButton>
                <Button
                  variant="contained"
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  sx={{
                    minWidth: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #ff6b9d 0%, #6c5ce7 100%)',
                    boxShadow: '0 8px 32px rgba(255, 107, 157, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #e91e63 0%, #5f3dc4 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 12px 40px rgba(255, 107, 157, 0.4)',
                    },
                    '&:disabled': {
                      background: '#e9ecef',
                      color: '#adb5bd',
                    },
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  <SendIcon />
                </Button>
              </Box>
            </Box>
            
            <Typography variant="caption" sx={{ color: '#636e72', textAlign: 'center', display: 'block' }}>
              Grace is powered by AI and may make mistakes. Your style journey is unique! ✨
            </Typography>
          </Box>
        </Box>
      </Box>

      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
          
          @keyframes pulse {
            0%, 70%, 100% {
              opacity: 0.4;
              transform: scale(1);
            }
            35% {
              opacity: 1;
              transform: scale(1.2);
            }
          }
        `}
      </style>
    </ThemeProvider>
  );
}

export default App;