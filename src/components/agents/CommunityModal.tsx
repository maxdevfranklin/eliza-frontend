import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
  CircularProgress,
  Stack,
  Box,
  useMediaQuery,
  useTheme,
  Typography,
  Paper,
} from '@mui/material';
import axios from 'axios';
import { getAgentByNameUrl, putAgentByNameUrl } from '../../config/api';
import {
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Web as WebIcon,
  Info as InfoIcon,
} from '@mui/icons-material';

interface CommunityModalProps {
  open: boolean;
  onClose: () => void;
}

const CommunityModal: React.FC<CommunityModalProps> = ({ open, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('xs'));

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [agent, setAgent] = useState<any | null>(null);
  const [form, setForm] = useState<Record<string, any>>({});

  useEffect(() => {
    if (!open) return;
    setError(null);
    setSuccess(null);
    setLoading(true);
    axios
      .get(getAgentByNameUrl())
      .then((res) => {
        if (res.data?.success && res.data.agent) {
          setAgent(res.data.agent);
          const initial: Record<string, any> = {};
          // Only load the grand_info field for this modal
          initial.grand_info = res.data.agent.grand_info || '';
          setForm(initial);
        } else {
          setError(res.data?.message || 'Failed to load community information');
        }
      })
      .catch((e) => setError(e?.message || 'Failed to load community information'))
      .finally(() => setLoading(false));
  }, [open]);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setSaving(true);
    setError(null);
    setSuccess(null);

    const updates: Record<string, any> = {};
    updates.grand_info = form.grand_info || '';

    axios
      .put(putAgentByNameUrl(), updates)
      .then((res) => {
        if (res.data?.success) {
          setSuccess('Community information updated successfully');
          // Update the local agent state
          setAgent((prev: any) => ({ ...prev, grand_info: form.grand_info }));
        } else {
          setError(res.data?.message || 'Failed to update community information');
        }
      })
      .catch((e) => {
        console.error('Update error:', e);
        setError(e?.message || 'Failed to update community information');
      })
      .finally(() => setSaving(false));
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth={isMobile ? "sm" : "md"} 
      fullWidth
      PaperProps={{
        sx: {
          margin: { xs: 2, sm: 3 },
          maxHeight: { xs: 'calc(100vh - 32px)', sm: 'calc(100vh - 48px)' },
        }
      }}
    >
      <DialogTitle sx={{ 
        fontSize: { xs: '1.1rem', sm: '1.25rem' },
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        <BusinessIcon sx={{ color: '#ff6b9d' }} />
        Grand Villa Community Information
      </DialogTitle>
      <DialogContent dividers sx={{ p: { xs: 2, sm: 3 } }}>
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <Stack spacing={3}>
            {/* Header with Grand Villa branding */}
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2, sm: 3 },
                background: 'linear-gradient(135deg, #ff6b9d 0%, #6c5ce7 100%)',
                color: 'white',
                textAlign: 'center',
                borderRadius: 2,
              }}
            >
              <Typography variant={isSmallMobile ? "h5" : "h4"} sx={{ fontWeight: 700, mb: 1 }}>
                Grand Villa Senior Living
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Looks like Home, Feels like Family
              </Typography>
            </Paper>

            {/* Community Information Editor */}
            <Box>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <InfoIcon sx={{ color: '#ff6b9d' }} />
                Community Information
              </Typography>
              <TextField
                label="Grand Villa Information"
                fullWidth
                multiline
                minRows={isMobile ? 8 : 12}
                value={form.grand_info || ''}
                onChange={(e) => handleChange('grand_info', e.target.value)}
                helperText="Enter detailed information about Grand Villa communities, services, amenities, pricing, and locations"
                size={isMobile ? "small" : "medium"}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    fontFamily: 'monospace',
                    fontSize: '0.9rem',
                  }
                }}
              />
            </Box>

            {/* Preview Section */}
            {form.grand_info && (
              <Box>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <InfoIcon sx={{ color: '#6c5ce7' }} />
                  Preview
                </Typography>
                <Paper
                  elevation={1}
                  sx={{
                    p: { xs: 2, sm: 3 },
                    background: '#f8f9fa',
                    border: '1px solid #e9ecef',
                    borderRadius: 2,
                    maxHeight: '300px',
                    overflow: 'auto',
                  }}
                >
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      whiteSpace: 'pre-wrap',
                      fontFamily: 'monospace',
                      fontSize: '0.85rem',
                      lineHeight: 1.6,
                    }}
                  >
                    {form.grand_info}
                  </Typography>
                </Paper>
              </Box>
            )}

            {success && <Alert severity="success">{success}</Alert>}
          </Stack>
        )}
      </DialogContent>
      <DialogActions sx={{ p: { xs: 2, sm: 3 } }}>
        <Button onClick={onClose} size={isMobile ? "medium" : "large"}>
          Close
        </Button>
        <Button 
          onClick={handleSave} 
          disabled={saving} 
          variant="contained"
          size={isMobile ? "medium" : "large"}
          sx={{
            background: 'linear-gradient(135deg, #ff6b9d 0%, #6c5ce7 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #e91e63 0%, #5f3dc4 100%)',
            }
          }}
        >
          {saving ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CommunityModal; 