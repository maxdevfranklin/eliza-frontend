import React, { useMemo, useState, useEffect } from 'react';
import { Box, Typography, Stepper, Step, StepLabel, StepContent, Card, Stack, Chip, TextField, MenuItem, useMediaQuery, useTheme, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { IntakeForm, DialogStep } from '../../types/chat';
import { formSteps, formStepFieldMap, fieldLabels, stepIcons, stepLabels } from '../../constants/steps';

interface SidebarProps {
  intakeForm: IntakeForm;
  onChange: (field: keyof IntakeForm, value: string) => void;
  onClose?: () => void;
}

const Sidebar = React.memo(({ intakeForm, onChange, onClose }: SidebarProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const totalFields = formSteps.flatMap((step) => formStepFieldMap[step]).length;
  const filledCount = formSteps
    .flatMap((step) => formStepFieldMap[step])
    .reduce((acc, field) => acc + (String(intakeForm[field] || '').trim().length > 0 ? 1 : 0), 0);

  const firstIncompleteIndex = useMemo(() => {
    const idx = formSteps.findIndex((step) => formStepFieldMap[step].some((f) => !String(intakeForm[f] || '').trim()));
    return idx === -1 ? formSteps.length - 1 : idx;
  }, [intakeForm]);

  const [activeStep, setActiveStep] = useState<number>(firstIncompleteIndex);

  useEffect(() => {
    setActiveStep(firstIncompleteIndex);
  }, [firstIncompleteIndex]);

  const isStepCompleted = (step: DialogStep) => formStepFieldMap[step].every((f) => String(intakeForm[f] || '').trim());

  const renderField = (field: keyof IntakeForm) => {
    const commonProps = {
      // key removed from spread props to avoid React key warning
      size: 'small' as const,
      fullWidth: true,
      label: fieldLabels[field],
      value: intakeForm[field] as string,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => onChange(field, e.target.value),
    };

    if (field === 'awareLooking') {
      return (
        <TextField key={field} select {...commonProps}>
          <MenuItem value="">Select</MenuItem>
          <MenuItem value="yes">Yes</MenuItem>
          <MenuItem value="no">No</MenuItem>
        </TextField>
      );
    }

    if (field === 'preferredContactMethod') {
      return (
        <TextField key={field} select {...commonProps}>
          <MenuItem value="">Select</MenuItem>
          <MenuItem value="phone">Phone</MenuItem>
          <MenuItem value="email">Email</MenuItem>
          <MenuItem value="mail">Mail</MenuItem>
        </TextField>
      );
    }

    const isMultiline = [
      'reasonForCall',
      'greatestConcern',
      'impact',
      'dailyRoutine',
      'enjoysDoing',
      'feelingsAboutMove',
      'othersInvolved',
      'mostImportant',
      'recap',
      'mailingAddress',
    ].includes(field as string);

    return (
      <TextField
        key={field}
        {...commonProps}
        multiline={isMultiline}
        minRows={isMultiline ? 2 : undefined}
      />
    );
  };

  return (
    <Box
      sx={{
        width: { xs: '100%', sm: 420 },
        height: '100%',
        background: 'linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)',
        borderRight: { xs: 'none', md: '1px solid #e9ecef' },
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ 
        p: { xs: 2, sm: 3 }, 
        borderBottom: '1px solid #e9ecef',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Box>
          <Typography variant={isSmallMobile ? "h5" : "h6"} sx={{ 
            fontWeight: 700, 
            color: '#2d3436', 
            mb: 0.5,
            fontSize: { xs: '1.2rem', sm: '1.25rem' }
          }}>
            Grand Villa Guide
          </Typography>
          <Typography variant="body2" sx={{ 
            color: '#636e72',
            fontSize: { xs: '0.8rem', sm: '0.875rem' }
          }}>
            Personal journey guided by ElizaOS
          </Typography>
        </Box>
        
        {isMobile && onClose && (
          <IconButton 
            onClick={onClose}
            sx={{ 
              color: '#636e72',
              '&:hover': { 
                color: '#ff6b9d', 
                backgroundColor: 'rgba(255, 107, 157, 0.1)' 
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        )}
      </Box>

      <Box sx={{ 
        flex: 1, 
        overflow: 'auto', 
        p: { xs: 2, sm: 3 } 
      }}>
        <Stepper activeStep={activeStep} orientation="vertical" connector={null}>
          {formSteps.map((step, index) => {
            const completed = isStepCompleted(step);
            return (
              <Step key={step} expanded active={index === activeStep} completed={completed}>
                <StepLabel>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ 
                      color: completed ? '#00b894' : '#ff6b9d', 
                      display: 'flex', 
                      alignItems: 'center' 
                    }}>
                      {stepIcons[step]}
                    </Box>
                    <Typography variant="subtitle1" sx={{ 
                      fontWeight: 700, 
                      color: '#2d3436',
                      fontSize: { xs: '0.9rem', sm: '1rem' }
                    }}>
                      {stepLabels[step]}
                    </Typography>
                    {completed && (
                      <Chip 
                        label="Done" 
                        size="small" 
                        sx={{ 
                          ml: 1, 
                          bgcolor: 'rgba(0,184,148,0.1)', 
                          color: '#00b894', 
                          fontWeight: 700,
                          fontSize: { xs: '0.6rem', sm: '0.75rem' },
                          height: { xs: 20, sm: 24 }
                        }} 
                      />
                    )}
                  </Box>
                </StepLabel>
                <StepContent TransitionProps={{ unmountOnExit: false }}>
                  <Card sx={{ 
                    p: { xs: 1.5, sm: 2 }, 
                    mt: 1, 
                    background: '#ffffff', 
                    boxShadow: '0 8px 24px rgba(0,0,0,0.06)', 
                    borderRadius: 3 
                  }}>
                    <Stack spacing={isSmallMobile ? 1 : 1.5}>
                      {formStepFieldMap[step].map(renderField)}
                    </Stack>
                  </Card>
                </StepContent>
              </Step>
            );
          })}
        </Stepper>
      </Box>
    </Box>
  );
});

export default Sidebar; 