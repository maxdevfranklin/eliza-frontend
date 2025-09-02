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
} from '@mui/material';
import axios from 'axios';
import { getAgentByNameUrl, putAgentByNameUrl } from '../../config/api';

interface AgentModalProps {
  open: boolean;
  onClose: () => void;
  name: string; // agent name, e.g., 'GraceFletcher'
}

const jsonFields = [
  'action',
  'message_examples',
  'post_examples',
  'topics',
  'adjectives',
  'knowledge',
  'plugins',
  'settings',
  'style',
  'grand_info',
] as const;

const editableFields = [
  'enabled',
  'username',
  'system',
  'bio',
  ...jsonFields,
] as const;

type EditableField = typeof editableFields[number];

const AgentModal: React.FC<AgentModalProps> = ({ open, onClose, name }) => {
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
          editableFields.forEach((field) => {
            const value = res.data.agent[field as string];
            if (jsonFields.includes(field as any)) {
              initial[field] = value ? JSON.stringify(value, null, 2) : '';
            } else {
              initial[field] = value ?? '';
            }
          });
          setForm(initial);
        } else {
          setError(res.data?.message || 'Failed to load agent');
        }
      })
      .catch((e) => setError(e?.message || 'Failed to load agent'))
      .finally(() => setLoading(false));
  }, [open, name]);

  const handleChange = (field: EditableField, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setSaving(true);
    setError(null);
    setSuccess(null);

    const updates: Record<string, any> = {};
    
        // Helper function to safely parse JSON
    const safeJsonParse = (value: string, fieldName: string): any => {
      if (!value || value.trim() === '') {
        return null;
      }
      
      const trimmed = value.trim();
      
      // If it's already a valid JSON object/array, parse it
      if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
        try {
          return JSON.parse(trimmed);
        } catch (e) {
          const errorMessage = e instanceof Error ? e.message : 'Unknown JSON parsing error';
          throw new Error(`Invalid JSON in ${fieldName}: ${errorMessage}`);
        }
      }
      
      // If it's a quoted string, parse it as JSON string
      if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
        try {
          return JSON.parse(trimmed);
        } catch {
          // If parsing fails, return as plain string without quotes
          return trimmed.slice(1, -1);
        }
      }
      
      // If it's a simple string without quotes, return as is
      if (!trimmed.startsWith('"') && !trimmed.startsWith('[') && !trimmed.startsWith('{')) {
        return trimmed;
      }
      
      // If it looks like it should be JSON but isn't valid, try to fix common issues
      try {
        // Try to escape any unescaped quotes in the middle
        const fixed = trimmed.replace(/(?<!\\)"/g, '\\"');
        return JSON.parse(fixed);
      } catch {
        // If all else fails, return as plain string
        return trimmed;
      }
    };

    // Helper function to safely serialize data for database
    const safeJsonSerialize = (value: any, fieldName: string): any => {
      if (value === null || value === undefined || value === '') {
        return null;
      }
      
      // If it's already a string, try to parse it first to see if it's JSON
      if (typeof value === 'string') {
        return safeJsonParse(value, fieldName);
      }
      
      // If it's an array or object, return it as-is (will be JSON.stringify'd by axios)
      if (Array.isArray(value) || typeof value === 'object') {
        return value;
      }
      
      // For other types, return as string
      return String(value);
    };

    try {
      editableFields.forEach((field) => {
        const raw = form[field as string];
        if (jsonFields.includes(field as any)) {
          updates[field] = safeJsonSerialize(raw, field);
        } else if (field === 'enabled') {
          updates[field] = String(raw).toLowerCase() === 'true' || raw === true;
        } else {
          updates[field] = raw;
        }
      });
         } catch (e) {
       setSaving(false);
       const errorMessage = e instanceof Error ? e.message : 'Unknown error occurred';
       setError(errorMessage);
       return;
     }

    // Debug: log what we're sending
    console.log('Sending updates:', JSON.stringify(updates, null, 2));
    console.log('Updates type check:', Object.keys(updates).map(key => `${key}: ${typeof updates[key]} (${Array.isArray(updates[key]) ? 'array' : 'not-array'})`));
    
    axios
      .put(putAgentByNameUrl(), updates)
      .then((res) => {
        if (res.data?.success) {
          setSuccess('Agent updated successfully');
        } else {
          setError(res.data?.message || 'Failed to update agent');
        }
      })
      .catch((e) => {
        console.error('Update error:', e);
        setError(e?.message || 'Failed to update agent');
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
      <DialogTitle sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
        Agent: {name}
      </DialogTitle>
      <DialogContent dividers sx={{ p: { xs: 2, sm: 3 } }}>
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <Stack spacing={2}>
            {/* Avatar Display */}
            {agent?.avatar && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <Box
                  component="img"
                  src={agent.avatar}
                  alt={`${name} avatar`}
                  sx={{
                    width: { xs: 80, sm: 120 },
                    height: { xs: 80, sm: 120 },
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid #e0e0e0',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  }}
                />
              </Box>
            )}
            
            <Box sx={{ 
              display: 'flex', 
              gap: 2,
              flexDirection: { xs: 'column', sm: 'row' }
            }}>
              <TextField
                label="Enabled"
                fullWidth
                value={form.enabled ?? ''}
                onChange={(e) => handleChange('enabled', e.target.value)}
                helperText="true/false"
                size={isMobile ? "small" : "medium"}
              />
              <TextField
                label="Username"
                fullWidth
                value={form.username ?? ''}
                onChange={(e) => handleChange('username', e.target.value)}
                size={isMobile ? "small" : "medium"}
              />
            </Box>
            
            {/* Action field - placed right after username as requested */}
            <TextField
              label="Action"
              fullWidth
              multiline
              minRows={isMobile ? 3 : 4}
              value={form.action ?? ''}
              onChange={(e) => handleChange('action', e.target.value)}
              helperText="JSON array of action instructions"
              size={isMobile ? "small" : "medium"}
            />
            
            <TextField
              label="System"
              fullWidth
              multiline
              minRows={isMobile ? 2 : 3}
              value={form.system ?? ''}
              onChange={(e) => handleChange('system', e.target.value)}
              size={isMobile ? "small" : "medium"}
            />
            <TextField
              label="Bio"
              fullWidth
              multiline
              minRows={isMobile ? 2 : 3}
              value={form.bio ?? ''}
              onChange={(e) => handleChange('bio', e.target.value)}
              size={isMobile ? "small" : "medium"}
            />

            {jsonFields.slice(1).map((field) => (
              <TextField
                key={field}
                label={field}
                fullWidth
                multiline
                minRows={isMobile ? 3 : 4}
                value={form[field] ?? ''}
                onChange={(e) => handleChange(field, e.target.value)}
                helperText="JSON"
                size={isMobile ? "small" : "medium"}
              />
            ))}

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
        >
          {saving ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AgentModal; 