import React, { useEffect, useState } from 'react';
import { getNotes, createNote, editNote, deleteNote } from '../../utils/api';
import { removeToken } from '../../utils/auth';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Grid,
  TextField,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function UserDashboard() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [noteData, setNoteData] = useState({ title: '', content: '' });
  const [selectedNoteId, setSelectedNoteId] = useState(null);

  const fetchNotes = () => {
    setLoading(true);
    getNotes({ search })
      .then(res => {
        const data = res?.data?.data?.notes || [];
        setNotes(Array.isArray(data) ? data : []);
      })
      .catch(() => setError('Failed to fetch notes'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchNotes();
    // eslint-disable-next-line
  }, [search]);

  const handleLogout = () => {
    removeToken();
    localStorage.removeItem('role');
    window.location.href = '/auth/login';
  };

  const handleOpen = (note = null) => {
    if (note) {
      setEditMode(true);
      setNoteData({ title: note.title, content: note.content });
      setSelectedNoteId(note.id);
    } else {
      setEditMode(false);
      setNoteData({ title: '', content: '' });
      setSelectedNoteId(null);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNoteData({ title: '', content: '' });
    setSelectedNoteId(null);
    setEditMode(false);
  };

  const handleSave = async () => {
    try {
      if (editMode && selectedNoteId) {
        await editNote(selectedNoteId, noteData);
      } else {
        await createNote(noteData);
      }
      fetchNotes();
      handleClose();
    } catch {
      setError('Failed to save note');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await deleteNote(id);
        fetchNotes();
      } catch {
        setError('Failed to delete note');
      }
    }
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Header Bar */}
      <Box
        sx={{
          px: { xs: 2, sm: 4 },
          py: 3,
          mb: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderRadius: 3,
          boxShadow: 4,
          background: 'linear-gradient(90deg, #1976d2 0%, #64b5f6 100%)',
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            color: '#fff',
            letterSpacing: 2,
            textShadow: '0 2px 8px rgba(25, 118, 210, 0.2)',
          }}
        >
          📒 My Notes
        </Typography>
        <Button
          variant="contained"
          color="error"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{
            fontWeight: 700,
            boxShadow: 2,
            bgcolor: '#fff',
            color: '#1976d2',
            '&:hover': { bgcolor: '#e3f2fd', color: '#1565c0' },
          }}
        >
          Logout
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={8}>
            <TextField
              label="Search Notes"
              fullWidth
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </Grid>
          <Grid item xs={4}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              fullWidth
              onClick={() => handleOpen()}
            >
              Add Note
            </Button>
          </Grid>
        </Grid>
      </Paper>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Grid container spacing={{ xs: 2, sm: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
          {notes.length === 0 ? (
            <Typography>No notes found.</Typography>
          ) : (
            notes.map(note => (
              <Grid item xs={4} sm={4} md={4} key={note.id}>
                <Paper
                  sx={{
                    p: 2,
                    position: 'relative',
                    border: '2px solid #1976d2',
                    borderRadius: 3,
                    bgcolor: '#f5faff',
                    boxShadow: 3,
                    transition: 'box-shadow 0.2s',
                    '&:hover': {
                      boxShadow: 6,
                      borderColor: '#1565c0',
                    },
                    minHeight: 150,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box>
                    <Typography variant="h6" color="primary">{note.title}</Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>{note.content}</Typography>
                  </Box>
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(note.created_at).toLocaleString()}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton color="primary" onClick={() => handleOpen(note)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDelete(note.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            ))
          )}
        </Grid>
      )}

      {/* Add/Edit Note Dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>{editMode ? 'Edit Note' : 'Add Note'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            fullWidth
            margin="normal"
            value={noteData.title}
            onChange={e => setNoteData({ ...noteData, title: e.target.value })}
          />
          <TextField
            label="Content"
            fullWidth
            margin="normal"
            multiline
            rows={4}
            value={noteData.content}
            onChange={e => setNoteData({ ...noteData, content: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            {editMode ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}