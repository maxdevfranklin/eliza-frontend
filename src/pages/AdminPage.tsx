import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  useTheme,
  useMediaQuery,
  IconButton,
  Chip,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Grid,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Person as PersonIcon,
  Chat as ChatIcon,
  Search as SearchIcon,
  AdminPanelSettings as AdminIcon,
  ArrowBack as ArrowBackIcon,
  SmartToy as BotIcon,
  Person as UserIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../auth/AuthContext';
import { getAdminUsersUrl, getAdminChatHistoryUrl } from '../config/api';

interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

interface ChatMessage {
  id: string;
  text: string;
  role: 'user' | 'assistant';
  timestamp: string;
  roomId: string;
  agentId: string;
}

interface ChatHistory {
  messages: ChatMessage[];
  user: User;
}

function AdminPage() {
  const { user, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatHistory | null>(null);
  const [loading, setLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch all users
  const fetchUsers = async () => {
    setUsersLoading(true);
    setError(null);
    try {
      const response = await axios.get(getAdminUsersUrl());
      if (response.data.success) {
        setUsers(response.data.users);
      } else {
        setError('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to fetch users');
    } finally {
      setUsersLoading(false);
    }
  };

  // Fetch chat history for selected user
  const fetchChatHistory = async (username: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(getAdminChatHistoryUrl(username));
      if (response.data.success) {
        setChatHistory(response.data);
      } else {
        setError(`Failed to fetch chat history: ${response.data.message}`);
      }
    } catch (error: any) {
      console.error('Error fetching chat history:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch chat history';
      setError(`Failed to fetch chat history: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle user selection
  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    fetchChatHistory(user.username);
  };

  // Filter users based on search term
  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  // Get message bubble color
  const getMessageColor = (role: 'user' | 'assistant') => {
    return role === 'user' 
      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Box
      sx={{
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        overflow: 'hidden',
      }}
    >
      {/* Left Sidebar - User Selection */}
      <Paper
        elevation={3}
        sx={{
          width: { xs: '100%', md: 350 },
          height: '100vh',
          borderRadius: 0,
          display: 'flex',
          flexDirection: 'column',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 3,
            borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
            background: 'linear-gradient(135deg, #ff6b9d 0%, #6c5ce7 100%)',
            color: 'white',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <IconButton 
              onClick={() => window.location.href = '/'}
              sx={{ color: 'white' }}
            >
              <ArrowBackIcon />
            </IconButton>
            <AdminIcon sx={{ fontSize: 28 }} />
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Admin Panel
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Manage users and view chat history
          </Typography>
        </Box>

        {/* Search */}
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
              },
            }}
          />
        </Box>

        {/* Users List */}
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          {usersLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ m: 2 }}>
              {error}
            </Alert>
          ) : (
            <List sx={{ p: 0 }}>
              {filteredUsers.map((user, index) => (
                <React.Fragment key={user.id}>
                  <ListItem
                    onClick={() => handleUserSelect(user)}
                    sx={{
                      cursor: 'pointer',
                      backgroundColor: selectedUser?.id === user.id ? 'rgba(255, 107, 157, 0.2)' : 'transparent',
                      '&:hover': {
                        backgroundColor: selectedUser?.id === user.id 
                          ? 'rgba(255, 107, 157, 0.3)' 
                          : 'rgba(255, 107, 157, 0.1)',
                      },
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          background: 'linear-gradient(135deg, #ff6b9d 0%, #6c5ce7 100%)',
                        }}
                      >
                        <PersonIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {user.username}
                        </Typography>
                      }
                      secondary={
                        <React.Fragment>
                          <Typography variant="body2" color="text.secondary" component="span" display="block">
                            {user.email}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" component="span" display="block">
                            Joined: {formatTimestamp(user.createdAt)}
                          </Typography>
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                  {index < filteredUsers.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </Box>

        {/* Footer */}
        <Box sx={{ p: 2, borderTop: '1px solid rgba(0, 0, 0, 0.1)' }}>
          <Typography variant="body2" color="text.secondary" align="center">
            {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} found
          </Typography>
        </Box>
      </Paper>

      {/* Right Side - Chat History */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
        }}
      >
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <Box
              sx={{
                p: 3,
                borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                background: 'rgba(255, 255, 255, 0.9)',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <Avatar
                  sx={{
                    background: 'linear-gradient(135deg, #ff6b9d 0%, #6c5ce7 100%)',
                  }}
                >
                  <PersonIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {selectedUser.username}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedUser.email}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip
                  label={`${chatHistory?.messages.length || 0} messages`}
                  size="small"
                  color="primary"
                />
                <Chip
                  label={`Joined ${formatTimestamp(selectedUser.createdAt)}`}
                  size="small"
                  variant="outlined"
                />
              </Box>
            </Box>

            {/* Chat Messages */}
            <Box
              sx={{
                flex: 1,
                overflow: 'auto',
                p: 3,
                background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 249, 250, 0.95) 100%)',
                '&::-webkit-scrollbar': { width: '8px' },
                '&::-webkit-scrollbar-track': { background: 'transparent' },
                '&::-webkit-scrollbar-thumb': { background: 'rgba(255, 107, 157, 0.3)', borderRadius: '4px' },
                '&::-webkit-scrollbar-thumb:hover': { background: 'rgba(255, 107, 157, 0.5)' },
              }}
            >
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                  <CircularProgress />
                </Box>
              ) : error ? (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              ) : chatHistory?.messages.length === 0 ? (
                <Box sx={{ textAlign: 'center', p: 4 }}>
                  <ChatIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    No chat history found
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    This user hasn't had any conversations yet.
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {chatHistory?.messages.map((message) => (
                    <Card
                      key={message.id}
                      sx={{
                        maxWidth: '80%',
                        alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
                        background: getMessageColor(message.role),
                        color: 'white',
                        borderRadius: 3,
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                      }}
                    >
                      <CardContent sx={{ p: 2, pb: '16px !important' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          {message.role === 'user' ? (
                            <UserIcon sx={{ fontSize: 16 }} />
                          ) : (
                            <BotIcon sx={{ fontSize: 16 }} />
                          )}
                          <Typography variant="caption" sx={{ opacity: 0.8 }}>
                            {message.role === 'user' ? 'User' : 'Grace'}
                          </Typography>
                        </Box>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                          {message.text}
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.7 }}>
                          {formatTimestamp(message.timestamp)}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              )}
            </Box>
          </>
        ) : (
          /* No User Selected State */
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              p: 4,
            }}
          >
            <ChatIcon sx={{ fontSize: 120, color: 'text.secondary', mb: 3 }} />
            <Typography variant="h4" color="text.secondary" sx={{ mb: 2 }}>
              Select a User
            </Typography>
            <Typography variant="body1" color="text.secondary" align="center">
              Choose a user from the left panel to view their chat history with Grace.
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default AdminPage; 