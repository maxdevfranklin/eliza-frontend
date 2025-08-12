import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  IconButton,
  useMediaQuery,
  Drawer,
  Badge,
  Avatar,
  Chip,
  Paper,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import DeleteIcon from '@mui/icons-material/Delete';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import MicIcon from '@mui/icons-material/Mic';
import ImageIcon from '@mui/icons-material/Image';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';
import { useAuth } from '../auth/AuthContext';
import { getMessageUrl, getAuthUrl } from '../config/api';
import Sidebar from '../components/sidebar/Sidebar';
import StepProgressPanel from '../components/progress/StepProgressPanel';
import StepNotification from '../components/progress/StepNotification';
import MessageBubble from '../components/chat/MessageBubble';
import TypingIndicator from '../components/chat/TypingIndicator';
import { Message, DialogStep, IntakeForm } from '../types/chat';
import { dialogSteps, stepLabels } from '../constants/steps';

function AuthenticatedApp() {
  const { user, logout } = useAuth();
  const muiTheme = useTheme();

  useEffect(() => {
    const originalError = console.error;
    console.error = (...args: any[]) => {
      if (args[0] && typeof args[0] === 'string' && args[0].includes('ResizeObserver loop completed with undelivered notifications')) {
        return;
      }
      originalError.apply(console, args);
    };
    return () => {
      console.error = originalError;
    };
  }, []);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'initial-message',
      text: 'Welcome to Grand Villas, Looks like Home, Feels like Family.  We are so glad you dropped by, what can I help you with today? ✨',
      sender: 'grace',
      timestamp: new Date(),
    },
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
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));

  const [intakeForm, setIntakeForm] = useState<IntakeForm>({
    name: '',
    phone: '',
    familyMemberName: '',
    reasonForCall: '',
    greatestConcern: '',
    impact: '',
    currentResidence: '',
    dailyRoutine: '',
    enjoysDoing: '',
    awareLooking: '',
    feelingsAboutMove: '',
    othersInvolved: '',
    mostImportant: '',
    recap: '',
    email: '',
    mailingAddress: '',
    preferredContactMethod: '',
    referralSource: '',
  });

  const handleIntakeChange = useCallback((field: keyof IntakeForm, value: string) => {
    setIntakeForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const generateMessageId = useCallback(() => {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  const handleStepProgress = useCallback(
    (newStep: DialogStep) => {
      if (newStep !== currentStep) {
        setCompletedSteps((prev) => {
          if (!prev.includes(currentStep)) {
            return [...prev, currentStep];
          }
          return prev;
        });

        setStepNotification(newStep);
        setTimeout(() => setStepNotification(null), 4000);
        setCurrentStep(newStep);
      }
    },
    [currentStep]
  );

  const stepProgress = useMemo(() => {
    const currentIndex = dialogSteps.indexOf(currentStep);
    const completedCount = completedSteps.length;
    return ((completedCount + (currentIndex >= 0 ? 0.5 : 0)) / dialogSteps.length) * 100;
  }, [currentStep, completedSteps]);

  const handleDeleteHistory = useCallback(async () => {
    if (!user?.username || isDeletingHistory) return;

    const confirmDelete = window.confirm('Are you sure you want to delete all conversation history? This action cannot be undone.');
    if (!confirmDelete) return;

    setIsDeletingHistory(true);

    try {
      const response = await axios.delete(getAuthUrl('delete-history'), {
        data: { userId: user.username },
      });

      if (response.data.success) {
        setMessages([
          {
            id: 'initial-message',
            text: 'Welcome to Grand Villas, Looks like Home, Feels like Family.  We are so glad you dropped by, what can I help you with today? ✨',
            sender: 'grace',
            timestamp: new Date(),
          },
        ]);
        setCurrentStep('trust_building');
        setCompletedSteps([]);
        setStepNotification(null);
        setStageNotRecognized(false);
        alert('Conversation history deleted successfully!');
      } else {
        throw new Error(response.data.message || 'Failed to delete history');
      }
    } catch (error) {
      console.error('Error deleting history:', error);
      alert('Failed to delete conversation history. Please try again.');
    } finally {
      setIsDeletingHistory(false);
    }
  }, [user?.username]);

  const [isDeletingHistory, setIsDeletingHistory] = useState(false);

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

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setIsTyping(true);
    setStageNotRecognized(false);
    setIsRecognizingStage(true);

    try {
      const response = await axios.post(getMessageUrl(), {
        text: currentInput,
        userId: user?.username || 'User',
        userName: user?.username || 'User',
      });

      setIsTyping(false);

      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        const lastResponse = response.data[response.data.length - 1];

        const graceMessage: Message = {
          id: `grace_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          text: lastResponse.text || 'Sorry, I encountered an error processing your message.',
          sender: 'grace',
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, graceMessage]);

        if (lastResponse?.metadata?.stage) {
          const stage = lastResponse.metadata.stage;
          const frontendStage = stage.toLowerCase().replace(/\s+/g, '_') as DialogStep;
          if (dialogSteps.includes(frontendStage)) {
            handleStepProgress(frontendStage);
          } else {
            setStageNotRecognized(true);
          }
        } else {
          setStageNotRecognized(true);
        }
      } else {
        const graceMessage: Message = {
          id: `grace_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          text: response.data?.text || 'Sorry, I encountered an error processing your message.',
          sender: 'grace',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, graceMessage]);
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
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
      setIsRecognizingStage(false);
    }
  }, [input, isLoading, generateMessageId, handleStepProgress, user?.username]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  return (
    <Box
      sx={{
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        overflow: 'hidden',
      }}
    >
      {!isMobile && <Sidebar intakeForm={intakeForm} onChange={handleIntakeChange} />}

      <Drawer
        anchor="left"
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: 420,
          },
        }}
      >
        <Sidebar intakeForm={intakeForm} onChange={handleIntakeChange} />
      </Drawer>

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
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
              <IconButton onClick={() => setSidebarOpen(true)} sx={{ color: '#2d3436' }}>
                <MenuIcon />
              </IconButton>
            )}

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={<Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#00b894', border: '2px solid white' }} />}
              >
                <Avatar sx={{ width: 56, height: 56, background: 'linear-gradient(135deg, #ff6b9d 0%, #6c5ce7 100%)', boxShadow: '0 8px 32px rgba(255, 107, 157, 0.3)' }}>
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
            <IconButton onClick={handleDeleteHistory} disabled={isDeletingHistory} sx={{ color: '#636e72', '&:hover': { color: '#ff6b9d', backgroundColor: 'rgba(255, 107, 157, 0.1)' }, '&:disabled': { color: '#ccc' } }} title="Delete Conversation History">
              <DeleteIcon />
            </IconButton>
            <IconButton onClick={logout} sx={{ color: '#636e72', '&:hover': { color: '#ff6b9d', backgroundColor: 'rgba(255, 107, 157, 0.1)' } }} title="Logout">
              <LogoutIcon />
            </IconButton>
            <IconButton sx={{ color: '#636e72' }}>
              <MoreVertIcon />
            </IconButton>
          </Box>
        </Box>

        <Box
          sx={{
            flex: 1,
            overflow: 'auto',
            p: 4,
            background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 249, 250, 0.95) 100%)',
            backdropFilter: 'blur(20px)',
            '&::-webkit-scrollbar': { width: '8px' },
            '&::-webkit-scrollbar-track': { background: 'transparent' },
            '&::-webkit-scrollbar-thumb': { background: 'rgba(255, 107, 157, 0.3)', borderRadius: '4px' },
            '&::-webkit-scrollbar-thumb:hover': { background: 'rgba(255, 107, 157, 0.5)' },
          }}
        >
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          <TypingIndicator isTyping={isTyping} />
          <div ref={messagesEndRef} />
        </Box>

        <Box sx={{ p: 3, background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255, 255, 255, 0.2)' }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton size="small" sx={{ color: '#636e72', '&:hover': { color: '#ff6b9d', backgroundColor: 'rgba(255, 107, 157, 0.1)' } }}>
                <AttachFileIcon />
              </IconButton>
              <IconButton size="small" sx={{ color: '#636e72', '&:hover': { color: '#ff6b9d', backgroundColor: 'rgba(255, 107, 157, 0.1)' } }}>
                <ImageIcon />
              </IconButton>
              <IconButton size="small" sx={{ color: '#636e72', '&:hover': { color: '#ff6b9d', backgroundColor: 'rgba(255, 107, 157, 0.1)' } }}>
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
              sx={{ '& .MuiOutlinedInput-root': { minHeight: '56px', alignItems: 'flex-end', pb: 1.5, fontSize: '1rem' } }}
            />

            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton sx={{ color: '#636e72', '&:hover': { color: '#ff6b9d', backgroundColor: 'rgba(255, 107, 157, 0.1)' } }}>
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
                  '&:disabled': { background: '#e9ecef', color: '#adb5bd' },
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                <SendIcon />
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>

      {!isMobile && (
        <StepProgressPanel currentStepProp={currentStep} completedStepsProp={completedSteps} stepProgressProp={stepProgress} />
      )}

      <StepNotification stepNotification={stepNotification} />
    </Box>
  );
}

export default AuthenticatedApp; 