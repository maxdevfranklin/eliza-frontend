import React from 'react';
import { Box, Typography, LinearProgress, Card, CardContent, Chip } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { DialogStep } from '../../types/chat';
import { dialogSteps, stepIcons, stepLabels, stepDescriptions } from '../../constants/steps';

interface StepProgressPanelProps {
  currentStepProp: DialogStep;
  completedStepsProp: DialogStep[];
  stepProgressProp: number;
}

const StepProgressPanel = React.memo(({ currentStepProp, completedStepsProp, stepProgressProp }: StepProgressPanelProps) => {
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
      <Box sx={{ p: 3, borderBottom: '1px solid #e9ecef' }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#2d3436', mb: 1 }}>
          Stage Progress
        </Typography>
        <Typography variant="body2" sx={{ color: '#636e72', mb: 2 }}>
          Your personalized discovery journey
        </Typography>
        <LinearProgress
          variant="determinate"
          value={stepProgressProp}
          sx={{
            height: 8,
            borderRadius: 4,
            bgcolor: 'rgba(255, 107, 157, 0.1)',
            '& .MuiLinearProgress-bar': {
              borderRadius: 4,
              background: 'linear-gradient(90deg, #ff6b9d 0%, #6c5ce7 100%)',
            },
          }}
        />
        <Typography variant="caption" sx={{ color: '#636e72', mt: 1, display: 'block' }}>
          {Math.round(stepProgressProp)}% Complete
        </Typography>
      </Box>

      <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
        {dialogSteps.map((step) => {
          const isCompleted = completedStepsProp.includes(step);
          const isCurrent = currentStepProp === step;
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
                color: isCurrent || isCompleted ? 'white' : 'text.primary',
                border: isUpcoming ? '2px dashed #e9ecef' : 'none',
                boxShadow:
                  isCurrent || isCompleted
                    ? '0 8px 32px rgba(255, 107, 157, 0.3)'
                    : '0 2px 8px rgba(0, 0, 0, 0.05)',
                transform: isCurrent ? 'scale(1.02)' : 'scale(1)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'visible',
                '&:hover': {
                  transform: isCurrent ? 'scale(1.02)' : 'scale(1.01)',
                  boxShadow:
                    isCurrent || isCompleted
                      ? '0 12px 40px rgba(255, 107, 157, 0.4)'
                      : '0 4px 16px rgba(0, 0, 0, 0.1)',
                },
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
                      background: isCurrent || isCompleted ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 107, 157, 0.1)',
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
                      sx={{ fontWeight: 600, fontSize: '1.1rem', mb: 0.5, color: 'inherit' }}
                    >
                      {stepLabels[step]}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8, fontSize: '0.9rem', color: 'inherit' }}>
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

export default StepProgressPanel; 