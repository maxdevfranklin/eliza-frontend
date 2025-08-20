import React from 'react';
import { Box, Card, CardContent, Typography, Zoom, useMediaQuery, useTheme } from '@mui/material';
import { DialogStep } from '../../types/chat';
import { stepIcons, stepLabels, stepDescriptions } from '../../constants/steps';

interface StepNotificationProps {
  stepNotification: DialogStep | null;
}

const StepNotification = React.memo(({ stepNotification }: StepNotificationProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Zoom in={!!stepNotification} timeout={300}>
      <Box
        sx={{
          position: 'fixed',
          top: { xs: 16, sm: 24 },
          right: { xs: 16, sm: 24 },
          left: { xs: 16, sm: 'auto' },
          zIndex: 1300,
          maxWidth: { xs: 'calc(100vw - 32px)', sm: 400 },
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
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 2 }, mb: 2 }}>
                <Box
                  sx={{
                    width: { xs: 40, sm: 48 },
                    height: { xs: 40, sm: 48 },
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backdropFilter: 'blur(10px)',
                    flexShrink: 0,
                  }}
                >
                  {stepIcons[stepNotification]}
                </Box>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography variant={isMobile ? "h6" : "h6"} sx={{ 
                    fontWeight: 600, 
                    mb: 0.5,
                    fontSize: { xs: '1rem', sm: '1.25rem' }
                  }}>
                    New Step Unlocked!
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    opacity: 0.9,
                    fontSize: { xs: '0.8rem', sm: '0.875rem' }
                  }}>
                    {stepLabels[stepNotification]}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" sx={{ 
                opacity: 0.8,
                fontSize: { xs: '0.8rem', sm: '0.875rem' }
              }}>
                {stepDescriptions[stepNotification]}
              </Typography>
            </CardContent>
          </Card>
        )}
      </Box>
    </Zoom>
  );
});

export default StepNotification; 