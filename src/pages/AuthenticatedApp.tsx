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
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import DeleteIcon from '@mui/icons-material/Delete';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import SendIcon from '@mui/icons-material/Send';
import MicIcon from '@mui/icons-material/Mic';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import InfoIcon from '@mui/icons-material/Info';
import BusinessIcon from '@mui/icons-material/Business';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import axios from 'axios';
import { useAuth } from '../auth/AuthContext';
import { getMessageUrl, getOpenAIMessageUrl, getAuthUrl, getSessionResetUrl, fetchComprehensiveRecord } from '../config/api';
import Sidebar from '../components/sidebar/Sidebar';
import StepProgressPanel from '../components/progress/StepProgressPanel';
import StepNotification from '../components/progress/StepNotification';
import MessageBubble from '../components/chat/MessageBubble';
import TypingIndicator from '../components/chat/TypingIndicator';
import CompletionModal from '../components/chat/CompletionModal';
import AgentModal from '../components/agents/AgentModal';
import CommunityModal from '../components/agents/CommunityModal';
import TestNotification from '../components/chat/TestNotification';
import { Message, DialogStep, IntakeForm } from '../types/chat';
import { dialogSteps, stepLabels } from '../constants/steps';
import { mapComprehensiveRecordToForm, testFormMapping } from '../utils/formMapper';

function AuthenticatedApp() {
  const { user, logout } = useAuth();
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));

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
  const [isDeletingHistory, setIsDeletingHistory] = useState(false);
  const [agentModalOpen, setAgentModalOpen] = useState(false);
  const [communityModalOpen, setCommunityModalOpen] = useState(false);
  const [completionModalOpen, setCompletionModalOpen] = useState(false);
  const [visitScheduledTime, setVisitScheduledTime] = useState<string>('');
  const [hasShownCompletionModal, setHasShownCompletionModal] = useState(false);
  const [showTestNotification, setShowTestNotification] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const [intakeForm, setIntakeForm] = useState<IntakeForm>({
    name: '',
    location: '',
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
    confidenceFactors: '',
    recap: '',
    email: '',
    mailingAddress: '',
    preferredContactMethod: '',
    referralSource: '',
  });

  // Monitor completion modal state
  useEffect(() => {
    console.log('🎯 Completion modal state changed:', {
      open: completionModalOpen,
      time: visitScheduledTime,
      hasShown: hasShownCompletionModal
    });
  }, [completionModalOpen, visitScheduledTime, hasShownCompletionModal]);

  // Fetch comprehensive record data and populate form
  const fetchAndPopulateForm = useCallback(async () => {
    if (!user?.username) return;

    try {
      // Use the actual IDs from the conversation
      const roomId = '45b0dcf5-802e-074e-9e67-84991c38b62e';
      const userId = user.username; // Use the authenticated user's username
      const agentId = '01c95267-dd29-02bc-a9ad-d243b05a8d51';

      const response = await fetchComprehensiveRecord(roomId, userId, agentId);
      
      if (response.success && response.data) {
        const { comprehensiveRecord, visitInfo } = response.data;
        
        console.log('📊 API Response:', response);
        console.log('📊 Comprehensive Record:', comprehensiveRecord);
        console.log('📊 Visit Info:', visitInfo);
        
        // Map the data to form fields
        const formData = mapComprehensiveRecordToForm(comprehensiveRecord, visitInfo);
        
        // Update the form with the fetched data
        setIntakeForm(prev => ({
          ...prev,
          ...formData
        }));

        // Check if visit has been scheduled
        if (comprehensiveRecord?.visit_scheduling && comprehensiveRecord.visit_scheduling.length > 0) {
          console.log('🔍 Found visit_scheduling entries:', comprehensiveRecord.visit_scheduling);
          const visitEntry = comprehensiveRecord.visit_scheduling.find(
            (entry: { question: string; answer: string; timestamp: string }) => 
              entry.question === "What time would work best for your visit?"
          );
          
          console.log('🔍 Found visit entry:', visitEntry);
          
          if (visitEntry && !hasShownCompletionModal) {
            console.log('✅ Visit scheduled! Showing completion modal for:', visitEntry.answer);
            setVisitScheduledTime(visitEntry.answer);
            setCompletionModalOpen(true);
            setHasShownCompletionModal(true);
          } else if (visitEntry && visitEntry.answer.includes('pending confirmation')) {
            console.log('⏳ Visit time suggested but pending confirmation:', visitEntry.answer);
          } else {
            console.log('❌ Visit not ready to show modal:', {
              hasEntry: !!visitEntry,
              answer: visitEntry?.answer,
              hasShown: hasShownCompletionModal
            });
          }
        } else {
          console.log('❌ No visit_scheduling entries found');
        }
      }
    } catch (error) {
      console.error('Error fetching comprehensive record:', error);
    }
  }, [user?.username, hasShownCompletionModal]);



  // Fetch form data when component mounts or user changes
  useEffect(() => {
    fetchAndPopulateForm();
    // Test the form mapping with sample data
    testFormMapping();
  }, [fetchAndPopulateForm]);

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
            const newCompleted = [...prev, currentStep];
            return newCompleted;
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
    // Count the current step as 1 (fully in progress) to show accurate progress
    return ((completedCount + (currentIndex >= 0 ? 1 : 0)) / dialogSteps.length) * 100;
  }, [currentStep, completedSteps]);

  const handleSessionReset = useCallback(async () => {
    if (!user?.username || isDeletingHistory) return;

    const confirmReset = window.confirm('Are you sure you want to reset your session? This will start a fresh conversation.');
    if (!confirmReset) return;

    setIsDeletingHistory(true);

    try {
      const response = await axios.post(getSessionResetUrl(), {
        userId: user.username,
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
        alert('Session reset successfully! Starting fresh conversation.');
      } else {
        throw new Error(response.data.message || 'Failed to reset session');
      }
    } catch (error) {
      console.error('Error resetting session:', error);
      alert('Failed to reset session. Please try again.');
    } finally {
      setIsDeletingHistory(false);
    }
  }, [user?.username, isDeletingHistory]);

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
      const response = await axios.post(getOpenAIMessageUrl(), {
        text: currentInput,
        userId: user?.username || 'User',
        userName: user?.username || 'User',
      });

      setIsTyping(false);

      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        const lastResponse = response.data[response.data.length - 1];

        // Add comprehensive logging for debugging responseStatus
        console.log('🚀 === FRONTEND RESPONSE PROCESSING ===');
        console.log('📦 Full response data:', response.data);
        console.log('📝 Last response object:', lastResponse);
        console.log('🏷️ Last response metadata:', lastResponse?.metadata);
        console.log('🔍 ResponseStatus in metadata:', lastResponse?.metadata?.responseStatus);
        console.log('📊 All metadata keys:', Object.keys(lastResponse?.metadata || {}));
        console.log('=====================================');

        const graceMessage: Message = {
          id: `grace_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          text: lastResponse.text || 'Sorry, I encountered an error processing your message.',
          sender: 'grace',
          timestamp: new Date(),
          metadata: lastResponse.metadata || {},
        };

        console.log('💬 Created grace message:', graceMessage);
        console.log('🔍 Grace message metadata:', graceMessage.metadata);
        console.log('🎯 Will show notification?', graceMessage.metadata?.responseStatus === 'Unexpected situation');

        setMessages((prev) => [...prev, graceMessage]);

        // Log the entire response for debugging
        console.log('🔍 Full response data:', response.data);
        console.log('📝 Last response:', lastResponse);
        console.log('🏷️ Last response metadata:', lastResponse?.metadata);
        
        if (lastResponse?.metadata?.stage) {
          const stage = lastResponse.metadata.stage;
          console.log('🎯 Raw stage from backend:', stage);
          const frontendStage = stage.toLowerCase().replace(/\s+/g, '_') as DialogStep;
          console.log('🔄 Converted frontend stage:', frontendStage);
          console.log('📋 Available dialog steps:', dialogSteps);
          console.log('✅ Is valid dialog step?', dialogSteps.includes(frontendStage));
          
          if (dialogSteps.includes(frontendStage)) {
            console.log('🚀 Calling handleStepProgress with:', frontendStage);
            handleStepProgress(frontendStage);
          } else {
            console.log('❌ Stage not recognized, setting stageNotRecognized to true');
            setStageNotRecognized(true);
          }
        } else {
          console.log('❌ No stage found in metadata, setting stageNotRecognized to true');
          console.log('🔍 Available metadata keys:', Object.keys(lastResponse?.metadata || {}));
          setStageNotRecognized(true);
        }
      } else {
        const graceMessage: Message = {
          id: `grace_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          text: response.data?.text || 'Sorry, I encountered an error processing your message.',
          sender: 'grace',
          timestamp: new Date(),
          metadata: response.data?.metadata || {},
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
      
      // Fetch updated form data after each message
      setTimeout(() => {
        fetchAndPopulateForm();
      }, 1000); // Small delay to ensure backend has processed the message
    }
  }, [input, isLoading, generateMessageId, handleStepProgress, user?.username, fetchAndPopulateForm]);

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
            width: { xs: '100%', sm: 420 },
            maxWidth: '100vw',
          },
        }}
      >
        <Sidebar 
          intakeForm={intakeForm} 
          onChange={handleIntakeChange} 
          onClose={() => setSidebarOpen(false)}
        />
      </Drawer>

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {showTestNotification && (
          <TestNotification />
        )}
        <Box
          sx={{
            p: { xs: 2, sm: 3 },
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: { xs: 'wrap', sm: 'nowrap' },
            gap: { xs: 1, sm: 0 },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 3 }, flex: 1, minWidth: 0 }}>
            {isMobile && (
              <IconButton onClick={() => setSidebarOpen(true)} sx={{ color: '#2d3436' }}>
                <MenuIcon />
              </IconButton>
            )}

            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 3 }, minWidth: 0 }}>
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={<Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#00b894', border: '2px solid white' }} />}
              >
                <Avatar sx={{ 
                  width: { xs: 40, sm: 56 }, 
                  height: { xs: 40, sm: 56 }, 
                  background: 'linear-gradient(135deg, #ff6b9d 0%, #6c5ce7 100%)', 
                  boxShadow: '0 8px 32px rgba(255, 107, 157, 0.3)' 
                }}>
                  <SmartToyIcon sx={{ fontSize: { xs: 20, sm: 28 } }} />
                </Avatar>
              </Badge>

              <Box sx={{ minWidth: 0 }}>
                <Typography variant={isSmallMobile ? "h6" : "h5"} sx={{ 
                  fontWeight: 700, 
                  color: '#2d3436', 
                  mb: 0.5,
                  fontSize: { xs: '1.1rem', sm: '1.5rem' }
                }}>
                  Grace
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: '#636e72', 
                  fontSize: { xs: '0.8rem', sm: '0.9rem' }
                }}>
                   Online •
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: { xs: 1, sm: 2 },
            flexWrap: { xs: 'wrap', sm: 'nowrap' },
            justifyContent: { xs: 'flex-end', sm: 'flex-start' }
          }}>
            {/* <Chip
              label={stepLabels[currentStep]}
              sx={{
                background: 'linear-gradient(135deg, #ff6b9d 0%, #6c5ce7 100%)',
                color: 'white',
                fontWeight: 600,
                fontSize: { xs: '0.7rem', sm: '0.8rem' },
                height: { xs: 24, sm: 32 },
              }}
            /> */}
            {!isSmallMobile && (
              <>
                            <Button 
              variant="outlined" 
              startIcon={<InfoIcon />} 
              onClick={() => setAgentModalOpen(true)}
              size={isMobile ? "small" : "medium"}
            >
              Agent
            </Button>
            <Button 
              variant="outlined" 
              startIcon={<BusinessIcon />} 
              onClick={() => setCommunityModalOpen(true)}
              size={isMobile ? "small" : "medium"}
            >
              Community
            </Button>
            {/* <Button 
              variant="outlined" 
              onClick={() => {
                setVisitScheduledTime("Test Time");
                setCompletionModalOpen(true);
              }}
                  size={isMobile ? "small" : "medium"}
            >
              Test Modal
            </Button> */}
            {/* <Button 
              variant="outlined" 
              onClick={() => setShowTestNotification(!showTestNotification)}
                  size={isMobile ? "small" : "medium"}
            >
              Test Notification
            </Button> */}
            <Button 
              variant="outlined" 
              startIcon={<AdminPanelSettingsIcon />} 
              onClick={() => window.location.href = '/admin'}
              size={isMobile ? "small" : "medium"}
            >
              Admin
            </Button>
              </>
            )}
            <IconButton 
              onClick={handleSessionReset} 
              disabled={isDeletingHistory} 
              sx={{ 
                color: '#636e72', 
                '&:hover': { color: '#ff6b9d', backgroundColor: 'rgba(255, 107, 157, 0.1)' }, 
                '&:disabled': { color: '#ccc' } 
              }} 
              title="Reset Session"
              size={isMobile ? "small" : "medium"}
            >
              <DeleteIcon />
            </IconButton>
            <IconButton 
              onClick={logout} 
              sx={{ 
                color: '#636e72', 
                '&:hover': { color: '#ff6b9d', backgroundColor: 'rgba(255, 107, 157, 0.1)' } 
              }} 
              title="Logout"
              size={isMobile ? "small" : "medium"}
            >
              <LogoutIcon />
            </IconButton>
            {!isSmallMobile && (
              <IconButton sx={{ color: '#636e72' }} size="small">
              <MoreVertIcon />
            </IconButton>
            )}
          </Box>
        </Box>

        <Box
          sx={{
            flex: 1,
            overflow: 'auto',
            p: { xs: 2, sm: 4 },
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

        <Box sx={{ 
          p: { xs: 2, sm: 3 }, 
          background: 'rgba(255, 255, 255, 0.95)', 
          backdropFilter: 'blur(20px)', 
          borderTop: '1px solid rgba(255, 255, 255, 0.2)' 
        }}>
          <Box sx={{ 
            display: 'flex', 
            gap: { xs: 1, sm: 2 }, 
            alignItems: 'flex-end',
            flexDirection: { xs: 'column', sm: 'row' }
          }}>
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
                  minHeight: { xs: '48px', sm: '56px' }, 
                  alignItems: 'flex-end', 
                  pb: { xs: 1, sm: 1.5 }, 
                  fontSize: { xs: '0.9rem', sm: '1rem' } 
                } 
              }}
            />

            <Box sx={{ 
              display: 'flex', 
              gap: 1,
              alignSelf: { xs: 'flex-end', sm: 'stretch' }
            }}>
              <IconButton sx={{ 
                color: '#636e72', 
                '&:hover': { color: '#ff6b9d', backgroundColor: 'rgba(255, 107, 157, 0.1)' } 
              }}>
                <MicIcon />
              </IconButton>
              <Button
                variant="contained"
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                sx={{
                  minWidth: { xs: '48px', sm: '56px' },
                  height: { xs: '48px', sm: '56px' },
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
      <AgentModal open={agentModalOpen} onClose={() => setAgentModalOpen(false)} name="GraceFletcher" />
      <CommunityModal open={communityModalOpen} onClose={() => setCommunityModalOpen(false)} />
      <CompletionModal 
        open={completionModalOpen} 
        onClose={() => {
          setCompletionModalOpen(false);
          // Don't reset hasShownCompletionModal - once shown, it should stay shown
          // until the conversation is reset
        }} 
        selectedTime={visitScheduledTime}
        userName={intakeForm.name}
        lovedOneName={intakeForm.familyMemberName}
      />
    </Box>
  );
}

export default AuthenticatedApp; 