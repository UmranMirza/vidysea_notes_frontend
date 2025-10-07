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
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

export default function UserDashboard() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [noteData, setNoteData] = useState({ title: '', content: '' });
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteNoteId, setDeleteNoteId] = useState(null);

  const fetchNotes = () => {
    setLoading(true);
    getNotes({ q })
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
  }, [q]);

  const handleLogout = () => {
    removeToken();
    localStorage.removeItem('role');
    window.location.href = '/auth/login';
  };

  const handleOpen = (note = null) => {
    if (note) {
      setEditMode(true);
      setNoteData({ title: note.title, description: note.description });
      setSelectedNoteId(note.id);
    } else {
      setEditMode(false);
      setNoteData({ title: '', description: '' });
      setSelectedNoteId(null);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNoteData({ title: '', description: '' });
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

  const handleDeleteClick = (id) => {
    setDeleteNoteId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteNote(deleteNoteId);
      fetchNotes();
    } catch {
      setError('Failed to delete note');
    }
    setDeleteDialogOpen(false);
    setDeleteNoteId(null);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setDeleteNoteId(null);
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

      {/* Search Bar & Add Button */}
      <Paper
        sx={{
          p: { xs: 2, sm: 3 },
          mb: 2,
          borderRadius: 4,
          boxShadow: 4,
          background: 'linear-gradient(90deg, #e3f2fd 0%, #64b5f6 100%)',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          flexWrap: 'wrap',
        }}
      >
        <TextField
          label="Search Notes by Title"
          fullWidth
          value={q}
          onKeyDown={e => setQ(e.target.value)}
          variant="outlined"
          sx={{
            flex: 1,
            bgcolor: '#fff',
            borderRadius: 3,
            boxShadow: 2,
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
            },
            '& .MuiInputLabel-root': {
              color: '#1976d2',
              fontWeight: 600,
            },
          }}
          InputProps={{
            sx: {
              fontWeight: 500,
              color: '#1565c0',
            },
          }}
        />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
          sx={{
            px: 4,
            py: 1.5,
            fontWeight: 700,
            fontSize: '1rem',
            borderRadius: 3,
            background: 'linear-gradient(90deg, #1976d2 0%, #64b5f6 100%)',
            color: '#fff',
            boxShadow: 3,
            textTransform: 'none',
            '&:hover': {
              background: 'linear-gradient(90deg, #1565c0 0%, #1976d2 100%)',
              boxShadow: 6,
            },
          }}
        >
          Add Note
        </Button>
      </Paper>

      {/* Notes Grid */}
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Grid
          container
          spacing={{ xs: 2, sm: 3 }}
          columns={{ xs: 12, sm: 12, md: 12 }}
          justifyContent="center"
        >
          {notes.length === 0 ? (
            <Typography>No notes found.</Typography>
          ) : (
            notes.map(note => (
              <Grid item xs={12} sm={8} md={6} key={note.id} display="flex" justifyContent="center">
                <Paper
                  sx={{
                    p: 4,
                    position: 'relative',
                    border: '2px solid #1976d2',
                    borderRadius: 4,
                    bgcolor: 'linear-gradient(135deg, #e3f2fd 0%, #64b5f6 100%)',
                    boxShadow: 4,
                    transition: 'box-shadow 0.2s, border-color 0.2s',
                    '&:hover': {
                      boxShadow: 8,
                      borderColor: '#1565c0',
                    },
                    minHeight: 250,
                    maxHeight: 350, // <-- set a max height
                    maxWidth: 600,
                    mx: 'auto',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box>
                    <Typography variant="h6" sx={{ color: '#1565c0', fontWeight: 700, fontSize: '1.3rem' }}>
                      {note.title}
                    </Typography>
                    <Box
                      sx={{
                        mt: 2,
                        color: '#1976d2',
                        fontSize: '1rem',
                        wordBreak: 'break-word',
                        whiteSpace: 'pre-line',
                        overflowWrap: 'break-word',
                        width:250,
                        maxHeight: 120, // <-- set a max height for description
                        overflowY: 'auto', // <-- make it scrollable if too long
                      }}
                    >
                      {note.description}
                    </Box>
                  </Box>
                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(note.created_at).toLocaleString()}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton color="primary" onClick={() => handleOpen(note)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDeleteClick(note.id)}>
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
            label="description"
            fullWidth
            margin="normal"
            multiline
            rows={4}
            value={noteData.description}
            onChange={e => setNoteData({ ...noteData, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            {editMode ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel} fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningAmberIcon color="warning" />
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this note? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDeleteConfirm}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}