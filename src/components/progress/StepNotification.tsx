import React from 'react';
import { Box, Card, CardContent, Typography, Zoom } from '@mui/material';
import { DialogStep } from '../../types/chat';
import { stepIcons, stepLabels, stepDescriptions } from '../../constants/steps';

interface StepNotificationProps {
  stepNotification: DialogStep | null;
}

const StepNotification = React.memo(({ stepNotification }: StepNotificationProps) => (
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

export default StepNotification; 