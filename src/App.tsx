import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
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
  Grid,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Collapse,
  Zoom,
  Grow,
  Alert,
  AlertTitle
} from '@mui/material';
import type { GridProps } from '@mui/material/Grid';
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
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import FiberManualRecord from '@mui/icons-material/FiberManualRecord';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import VideocamIcon from '@mui/icons-material/Videocam';
import axios from 'axios';
import { AuthProvider, useAuth } from './auth/AuthContext';
import { AuthPage } from './auth/AuthPage';

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
  needs_matching: 'Needs Matching',
  visit_transition: 'Next Steps'
};

const stepDescriptions = {
  trust_building: 'Setting the tone & Earning trust',
  situation_discovery: 'Unnderstanding youur situation & motivations',
  lifestyle_discovery: 'Understanding the prospect lifestyle',
  readiness_discovery: 'Gauging your awareness & Readiness',
  priorities_discovery: 'Understanding priorities in a community',
  needs_matching: 'Connecting priorities to community',
  visit_transition: 'Transitioning to a visit'
};

const stepIcons = {
  trust_building: <FavoriteIcon />,
  situation_discovery: <PersonIcon />,
  lifestyle_discovery: <StyleIcon />,
  readiness_discovery: <TrendingUpIcon />,
  priorities_discovery: <StarIcon />,
  needs_matching: <AutoAwesomeIcon />,
  visit_transition: <TrendingFlatIcon />
};

const sidebarItems = [
  { icon: <VideocamIcon />, text: 'Video Conversation', badge: null },
  { icon: <TrendingUpIcon />, text: 'User Insights', badge: '1' },
  { icon: <PaletteIcon />, text: 'Theme Customization', badge: '3' },
  { icon: <ShoppingBagIcon />, text: 'Plan Upgrades', badge: null },
  { icon: <FavoriteIcon />, text: 'Saved Favorites', badge: '0' },
];

function AuthenticatedApp() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'initial-message',
      text: "Welcome to Grand Villas, Looks like Home, Feels like Family.  We are so glad you dropped by, what can I help you with today? ✨",
      sender: 'grace',
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<DialogStep>('trust_building');
  const [completedSteps, setCompletedSteps] = useState<DialogStep[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stepNotification, setStepNotification] = useState<DialogStep | null>(null);
  const [stageNotRecognized, setStageNotRecognized] = useState(false);
  const [isRecognizingStage, setIsRecognizingStage] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);
  
  const generateMessageId = useCallback(() => {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  const handleStepProgress = useCallback((newStep: DialogStep) => {
    if (newStep !== currentStep) {
      // Mark current step as completed
      setCompletedSteps(prev => {
        if (!prev.includes(currentStep)) {
          return [...prev, currentStep];
        }
        return prev;
      });
      
      // Show notification for new step
      setStepNotification(newStep);
      setTimeout(() => setStepNotification(null), 4000);
      
      // Update current step
      setCurrentStep(newStep);
    }
  }, [currentStep]);

  // Memoize step progress calculation to prevent unnecessary recalculations
  const stepProgress = useMemo(() => {
    const currentIndex = dialogSteps.indexOf(currentStep);
    const completedCount = completedSteps.length;
    return ((completedCount + (currentIndex >= 0 ? 0.5 : 0)) / dialogSteps.length) * 100;
  }, [currentStep, completedSteps]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const currentInput = input.trim();
    const messageId = generateMessageId();
    
    const userMessage: Message = {
      id: messageId,
      text: currentInput,
      sender: 'user',
      timestamp: new Date(),
    };

    // Add user message and clear input immediately
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setIsTyping(true);
    setStageNotRecognized(false); // Reset stage recognition state
    setIsRecognizingStage(true); // Set recognizing state to true

    try {
      // const response = await axios.post('https://eliza-backend-production-4791.up.railway.app/01c95267-dd29-02bc-a9ad-d243b05a8d51/message', {
      const response = await axios.post('http://localhost:3000/01c95267-dd29-02bc-a9ad-d243b05a8d51/message', {
        text: currentInput,
        userId: user?.username || "User",
        userName: user?.username || "User"
      });

      // Stop typing indicator
      setIsTyping(false);

      // Process response data
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        // Get the last response only
        const lastResponse = response.data[response.data.length - 1];
        
        // Create a single Grace message with the last response
        const graceMessage: Message = {
          id: `grace_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          text: lastResponse.text || 'Sorry, I encountered an error processing your message.',
          sender: 'grace' as const,
          timestamp: new Date(),
        };

        // Add the Grace message
        setMessages(prev => [...prev, graceMessage]);

        // Update step if provided in the last response
        console.log('Last response:', lastResponse); // Debug log
        console.log('Response metadata:', lastResponse?.metadata); // Debug log
        if (lastResponse?.metadata?.stage) {
          const stage = lastResponse.metadata.stage;
          console.log('Stage from backend:', stage); // Debug log
          // Convert backend stage to frontend DialogStep
          const frontendStage = stage.toLowerCase().replace(/\s+/g, '_') as DialogStep;
          console.log('Converted frontend stage:', frontendStage); // Debug log
          if (dialogSteps.includes(frontendStage)) {
            console.log('Updating stage to:', frontendStage); // Debug log
            handleStepProgress(frontendStage);
          } else {
            setStageNotRecognized(true);
          }
        } else {
          setStageNotRecognized(true);
        }
      } else {
        // Handle single response or error case
        const graceMessage: Message = {
          id: `grace_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
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
        id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        text: 'Sorry, I encountered a connection error. Please try again.',
        sender: 'grace',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
      setIsRecognizingStage(false); // Reset recognizing state
    }
  }, [input, isLoading, generateMessageId, handleStepProgress]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  // Memoized message bubble component to prevent unnecessary re-renders
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

  // Memoized Step Progress Panel with stable props
  const StepProgressPanel = React.memo(() => {
    return (
      <Box
        sx={{
          width: 380,
          height: '100%',
          background: 'linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)',
          borderLeft: '1px solid #e9ecef',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Step Progress Header */}
        <Box sx={{ p: 3, borderBottom: '1px solid #e9ecef' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#2d3436', mb: 1 }}>
            Stage Progress
          </Typography>
          <Typography variant="body2" sx={{ color: '#636e72', mb: 2 }}>
            Your personalized discovery journey
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={stepProgress} 
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
          <Typography variant="caption" sx={{ color: '#636e72', mt: 1, display: 'block' }}>
            {Math.round(stepProgress)}% Complete
          </Typography>
        </Box>

        {/* Steps List */}
        <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
          {dialogSteps.map((step, index) => {
            const isCompleted = completedSteps.includes(step);
            const isCurrent = currentStep === step;
            const isUpcoming = !isCompleted && !isCurrent;

            return (
              <Card
                key={step}
                sx={{
                  mb: 2,
                  background: isCurrent 
                    ? 'linear-gradient(135deg, #ff6b9d 0%, #6c5ce7 100%)'
                    : isCompleted 
                      ? 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)'
                      : '#ffffff',
                  color: (isCurrent || isCompleted) ? 'white' : 'text.primary',
                  border: isUpcoming ? '2px dashed #e9ecef' : 'none',
                  boxShadow: (isCurrent || isCompleted) 
                    ? '0 8px 32px rgba(255, 107, 157, 0.3)' 
                    : '0 2px 8px rgba(0, 0, 0, 0.05)',
                  transform: isCurrent ? 'scale(1.02)' : 'scale(1)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'visible',
                  '&:hover': {
                    transform: isCurrent ? 'scale(1.02)' : 'scale(1.01)',
                    boxShadow: (isCurrent || isCompleted) 
                      ? '0 12px 40px rgba(255, 107, 157, 0.4)' 
                      : '0 4px 16px rgba(0, 0, 0, 0.1)',
                  }
                }}
              >
                {isCurrent && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -2,
                      left: -2,
                      right: -2,
                      bottom: -2,
                      background: 'linear-gradient(45deg, #ff6b9d, #6c5ce7, #ff6b9d)',
                      borderRadius: 3,
                      zIndex: -1,
                      animation: 'gradientShift 3s ease-in-out infinite',
                    }}
                  />
                )}
                
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        background: (isCurrent || isCompleted) 
                          ? 'rgba(255, 255, 255, 0.2)' 
                          : 'rgba(255, 107, 157, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backdropFilter: 'blur(10px)',
                      }}
                    >
                      {isCompleted ? (
                        <CheckCircleIcon sx={{ color: 'inherit', fontSize: 24 }} />
                      ) : isCurrent ? (
                        <Box sx={{ color: 'inherit' }}>{stepIcons[step]}</Box>
                      ) : (
                        <RadioButtonUncheckedIcon sx={{ color: '#636e72', fontSize: 24 }} />
                      )}
                    </Box>
                    
                    <Box sx={{ flex: 1 }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 600, 
                          fontSize: '1.1rem',
                          mb: 0.5,
                          color: 'inherit'
                        }}
                      >
                        {stepLabels[step]}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          opacity: 0.8,
                          fontSize: '0.9rem',
                          color: 'inherit'
                        }}
                      >
                        {stepDescriptions[step]}
                      </Typography>
                    </Box>

                    {isCurrent && (
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          background: 'rgba(255, 255, 255, 0.8)',
                          animation: 'pulse 2s ease-in-out infinite',
                        }}
                      />
                    )}
                  </Box>

                  {isCompleted && (
                    <Chip
                      label="Completed"
                      size="small"
                      sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        color: 'inherit',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                      }}
                    />
                  )}
                  
                  {isCurrent && (
                    <Chip
                      label="In Progress"
                      size="small"
                      sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        color: 'inherit',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                      }}
                    />
                  )}
                </CardContent>
              </Card>
            );
          })}
        </Box>
      </Box>
    );
  });

  const StepNotification = React.memo(() => (
    <Zoom in={!!stepNotification} timeout={300}>
      <Box
        sx={{
          position: 'fixed',
          top: 24,
          right: 24,
          zIndex: 1300,
          maxWidth: 400,
        }}
      >
        {stepNotification && (
          <Card
            sx={{
              background: 'linear-gradient(135deg, #ff6b9d 0%, #6c5ce7 100%)',
              color: 'white',
              boxShadow: '0 12px 40px rgba(255, 107, 157, 0.4)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  {stepIcons[stepNotification]}
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                    New Step Unlocked!
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    {stepLabels[stepNotification]}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                {stepDescriptions[stepNotification]}
              </Typography>
            </CardContent>
          </Card>
        )}
      </Box>
    </Zoom>
  ));

  const Sidebar = React.memo(() => (
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
          Grand Villa Guide
        </Typography>
        <Typography variant="body2" sx={{ color: '#636e72' }}>
          Personal journey guided by ElizaOS
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
          Your Progress Status
        </Typography>
        {stageNotRecognized ? (
          <Alert 
            severity="warning" 
            sx={{ 
              mb: 2,
              '& .MuiAlert-icon': {
                color: '#ff6b9d'
              },
              '& .MuiAlert-message': {
                color: '#2d3436'
              }
            }}
          >
            <AlertTitle sx={{ color: '#2d3436', fontWeight: 600 }}>Stage Not Recognized</AlertTitle>
            The conversation is not progressing through the expected stages. Please try to stay focused on the current topic.
          </Alert>
        ) : isRecognizingStage ? (
          <Alert 
            severity="info" 
            sx={{ 
              mb: 2,
              '& .MuiAlert-icon': {
                color: '#6c5ce7'
              },
              '& .MuiAlert-message': {
                color: '#2d3436'
              }
            }}
          >
            <AlertTitle sx={{ color: '#2d3436', fontWeight: 600 }}>Now Recognizing Step</AlertTitle>
            Processing your response to determine the next stage...
          </Alert>
        ) : (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Card sx={{ textAlign: 'center', p: 2, backgroundColor: '#fff5f8' }}>
                <StarIcon sx={{ color: '#ff6b9d', mb: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#2d3436' }}>
                  4.8
                </Typography>
                <Typography variant="caption" sx={{ color: '#636e72' }}>
                  Progress Score
                </Typography>
              </Card>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Card sx={{ textAlign: 'center', p: 2, backgroundColor: '#f0f0ff' }}>
                <ShoppingBagIcon sx={{ color: '#6c5ce7', mb: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#2d3436' }}>
                  0
                </Typography>
                <Typography variant="caption" sx={{ color: '#636e72' }}>
                  Outfits
                </Typography>
              </Card>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  ));

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
                    Senior Sherpa • Online
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Chip
                label={stepLabels[currentStep]}
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
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
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
          </Box>
        </Box>

        {/* Step Progress Panel - Desktop Only */}
        {!isMobile && <StepProgressPanel />}

        {/* Step Notification */}
        <StepNotification />
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

          @keyframes gradientShift {
            0%, 100% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
          }
        `}
      </style>
    </ThemeProvider>
  );
}

function App() {
  const [showAuth, setShowAuth] = useState(false);

  const handleAuthSuccess = () => {
    setShowAuth(false);
  };

  return (
    <AuthProvider>
      <AppContent onShowAuth={() => setShowAuth(true)} showAuth={showAuth} onAuthSuccess={handleAuthSuccess} />
    </AuthProvider>
  );
}

function AppContent({ onShowAuth, showAuth, onAuthSuccess }: { onShowAuth: () => void; showAuth: boolean; onAuthSuccess: () => void }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated || showAuth) {
    return <AuthPage onAuthSuccess={onAuthSuccess} />;
  }

  return <AuthenticatedApp />;
}

export default App;