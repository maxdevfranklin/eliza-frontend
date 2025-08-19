import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Paper,
  IconButton,
  useTheme,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  OpenInNew as OpenInNewIcon,
  Close as CloseIcon,
  Celebration as CelebrationIcon,
} from '@mui/icons-material';

interface CompletionModalProps {
  open: boolean;
  onClose: () => void;
  selectedTime?: string;
  userName?: string;
  lovedOneName?: string;
}

const CompletionModal: React.FC<CompletionModalProps> = ({
  open,
  onClose,
  selectedTime,
  userName,
  lovedOneName,
}) => {
  const theme = useTheme();

  const handleVisitWebsite = () => {
    window.open('https://www.grandvillasenior.com/care-levels', '_blank');
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          overflow: 'hidden',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            pointerEvents: 'none',
          },
        },
      }}
    >
      {/* Close button */}
      <IconButton
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: 16,
          top: 16,
          color: 'white',
          zIndex: 1,
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          },
        }}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent sx={{ p: 0, position: 'relative' }}>
        {/* Header with celebration icon */}
        <Box
          sx={{
            textAlign: 'center',
            py: 4,
            px: 3,
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mb: 2,
            }}
          >
            <Box
              sx={{
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                animation: 'pulse 2s infinite',
                '@keyframes pulse': {
                  '0%, 70%, 100%': {
                    opacity: 0.4,
                    transform: 'scale(1)',
                  },
                  '35%': {
                    opacity: 1,
                    transform: 'scale(1.1)',
                  },
                },
              }}
            >
              <CheckCircleIcon sx={{ fontSize: 40, color: '#4CAF50' }} />
            </Box>
          </Box>

          <Typography
            variant="h4"
            component="h2"
            sx={{
              fontWeight: 700,
              mb: 1,
              background: 'linear-gradient(45deg, #fff, #f0f8ff)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Visit Scheduled! 🎉
          </Typography>

          <Typography
            variant="body1"
            sx={{
              opacity: 0.9,
              fontSize: '1.1rem',
              fontWeight: 500,
            }}
          >
            {userName ? `Congratulations, ${userName}!` : 'Congratulations!'} Your visit is all set.
          </Typography>
        </Box>

        {/* Content */}
        <Box sx={{ p: 4 }}>
          {/* Visit details */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 3,
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: 2,
              border: '1px solid rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CelebrationIcon sx={{ mr: 1, color: '#FFD700' }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Visit Details
              </Typography>
            </Box>

            <Typography variant="body1" sx={{ mb: 2, opacity: 0.9 }}>
              <strong>Time:</strong> {selectedTime || 'Your scheduled time'}
            </Typography>

            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              {lovedOneName ? (
                <>
                  We're excited to show you and <strong>{lovedOneName}</strong> around Grand Villa and let you experience what daily life would feel like here.
                </>
              ) : (
                <>
                  We're excited to show you around Grand Villa and let you experience what daily life would feel like here.
                </>
              )}
            </Typography>
          </Paper>

          {/* Next steps */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 3,
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: 2,
              border: '1px solid rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              What's Next?
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                ✓ You'll receive a confirmation email with all the details
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                ✓ Our team will follow up to ensure you have everything you need
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                ✓ Explore our care levels and amenities to learn more
              </Typography>
            </Box>
          </Paper>

          {/* Call to action */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="body1"
              sx={{
                mb: 3,
                opacity: 0.9,
                fontSize: '1.1rem',
                fontWeight: 500,
              }}
            >
              Ready to learn more about our care levels and amenities?
            </Typography>

            <Button
              variant="contained"
              size="large"
              onClick={handleVisitWebsite}
              startIcon={<OpenInNewIcon />}
              sx={{
                background: 'linear-gradient(45deg, #4CAF50, #45a049)',
                color: 'white',
                px: 4,
                py: 1.5,
                borderRadius: 3,
                fontSize: '1.1rem',
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: '0 8px 25px rgba(76, 175, 80, 0.3)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'linear-gradient(45deg, #45a049, #4CAF50)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 35px rgba(76, 175, 80, 0.4)',
                },
              }}
            >
              Visit Grand Villa Website
            </Button>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button
          onClick={onClose}
          sx={{
            color: 'white',
            borderColor: 'rgba(255, 255, 255, 0.3)',
            '&:hover': {
              borderColor: 'rgba(255, 255, 255, 0.5)',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
          variant="outlined"
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CompletionModal; 