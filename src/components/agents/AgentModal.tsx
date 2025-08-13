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
} from '@mui/material';
import axios from 'axios';
import { getAgentByNameUrl, putAgentByNameUrl } from '../../config/api';

interface AgentModalProps {
  open: boolean;
  onClose: () => void;
  name: string; // agent name, e.g., 'GraceFletcher'
}

const jsonFields = [
  'message_examples',
  'post_examples',
  'topics',
  'adjectives',
  'knowledge',
  'plugins',
  'settings',
  'style',
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
    editableFields.forEach((field) => {
      const raw = form[field as string];
      if (jsonFields.includes(field as any)) {
        if (raw === '' || raw === undefined || raw === null) {
          updates[field] = null;
        } else {
          try {
            updates[field] = JSON.parse(raw);
          } catch (e) {
            setSaving(false);
            setError(`Invalid JSON in ${field}`);
            throw e;
          }
        }
      } else if (field === 'enabled') {
        updates[field] = String(raw).toLowerCase() === 'true' || raw === true;
      } else {
        updates[field] = raw;
      }
    });

    axios
      .put(putAgentByNameUrl(), updates)
      .then((res) => {
        if (res.data?.success) {
          setSuccess('Agent updated successfully');
        } else {
          setError(res.data?.message || 'Failed to update agent');
        }
      })
      .catch((e) => setError(e?.message || 'Failed to update agent'))
      .finally(() => setSaving(false));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Agent: {name}</DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Enabled"
                fullWidth
                value={form.enabled ?? ''}
                onChange={(e) => handleChange('enabled', e.target.value)}
                helperText="true/false"
              />
              <TextField
                label="Username"
                fullWidth
                value={form.username ?? ''}
                onChange={(e) => handleChange('username', e.target.value)}
              />
            </Box>
            <TextField
              label="System"
              fullWidth
              multiline
              minRows={3}
              value={form.system ?? ''}
              onChange={(e) => handleChange('system', e.target.value)}
            />
            <TextField
              label="Bio"
              fullWidth
              multiline
              minRows={3}
              value={form.bio ?? ''}
              onChange={(e) => handleChange('bio', e.target.value)}
            />

            {jsonFields.map((field) => (
              <TextField
                key={field}
                label={field}
                fullWidth
                multiline
                minRows={4}
                value={form[field] ?? ''}
                onChange={(e) => handleChange(field, e.target.value)}
                helperText="JSON"
              />
            ))}

            {success && <Alert severity="success">{success}</Alert>}
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button onClick={handleSave} disabled={saving} variant="contained">
          {saving ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AgentModal; 