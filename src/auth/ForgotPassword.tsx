import React, { useState } from 'react';
import {
  Box, Paper, TextField, Button, Typography, Alert, CircularProgress
} from '@mui/material';

interface ForgotPasswordProps {
  onBack?: () => void;
}

export const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle'|'loading'|'sent'>('idle');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      // Generic success message avoids account enumeration
      setStatus('sent');
    } catch {
      setStatus('sent');
    }
  };

  return (
    <Paper elevation={8} sx={{
      p: 4, maxWidth: 400, width: '100%', borderRadius: 3,
      background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,249,250,0.95) 100%)',
      backdropFilter: 'blur(10px)',
    }}>
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight={700} color="primary.main">Reset your password</Typography>
        <Typography variant="body2" color="text.secondary">Enter your email and we’ll send a reset link.</Typography>
      </Box>

      <Box component="form" onSubmit={submit}>
        <TextField
          fullWidth label="Email" type="email" value={email}
          onChange={e => setEmail(e.target.value)} required sx={{ mb: 2 }}
        />
        <Button type="submit" fullWidth variant="contained" disabled={status==='loading'}
          sx={{ mb: 2, py: 1.5, fontWeight: 600 }}>
          {status==='loading' ? <CircularProgress size={22} color="inherit" /> : 'Send reset link'}
        </Button>

        {status==='sent' && (
          <Alert severity="info" sx={{ borderRadius: 2 }}>
            If an account exists for this email, a reset link has been sent.
          </Alert>
        )}

        {onBack && (
          <Button onClick={onBack} fullWidth sx={{ mt: 2 }}>Back to sign in</Button>
        )}
      </Box>
    </Paper>
  );
};
