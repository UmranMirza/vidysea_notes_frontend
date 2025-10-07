import React, { useEffect, useState } from 'react';
import { getAllNotes, createNoteAdmin, editNoteAdmin, deleteNoteAdmin } from '../../utils/api';
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

export default function AdminDashboard() {
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
    getAllNotes({ q })
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
      setNoteData({ title: note.title, description: note.content });
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
        await editNoteAdmin(selectedNoteId, noteData);
      } else {
        await createNoteAdmin(noteData);
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
      await deleteNoteAdmin(deleteNoteId);
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
          background: 'linear-gradient(90deg, #8e24aa 0%, #ce93d8 100%)',
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            color: '#fff',
            letterSpacing: 2,
            textShadow: '0 2px 8px rgba(142,36,170,0.2)',
          }}
        >
          🛡️ Admin Notes
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
            color: '#8e24aa',
            '&:hover': { bgcolor: '#f3e5f5', color: '#6d1b7b' },
          }}
        >
          Logout
        </Button>
      </Box>

      <Paper
        sx={{
          p: { xs: 2, sm: 3 },
          mb: 2,
          borderRadius: 4,
          boxShadow: 4,
          background: 'linear-gradient(90deg, #f3e5f5 0%, #ce93d8 100%)',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          flexWrap: 'wrap',
        }}
      >
        <TextField
          label="Search Notes By Title"
          fullWidth
          value={q}
          onChange={e => setQ(e.target.value)}
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
              color: '#8e24aa',
              fontWeight: 600,
            },
          }}
          InputProps={{
            sx: {
              fontWeight: 500,
              color: '#6d1b7b',
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
            background: 'linear-gradient(90deg, #8e24aa 0%, #ce93d8 100%)',
            color: '#fff',
            boxShadow: 3,
            textTransform: 'none',
            '&:hover': {
              background: 'linear-gradient(90deg, #6d1b7b 0%, #ab47bc 100%)',
              boxShadow: 6,
            },
          }}
        >
          Add Note
        </Button>
      </Paper>
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
                    border: '2px solid #8e24aa',
                    borderRadius: 4,
                    bgcolor: 'linear-gradient(135deg, #ce93d8 0%, #f3e5f5 100%)',
                    boxShadow: 4,
                    transition: 'box-shadow 0.2s, border-color 0.2s',
                    '&:hover': {
                      boxShadow: 8,
                      borderColor: '#6d1b7b',
                    },
                    minHeight: 250,
                    maxHeight: 350, // fixed max height
                    maxWidth: 600,
                    mx: 'auto',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="h6" sx={{ color: '#6d1b7b', fontWeight: 700, fontSize: '1.3rem' }}>
                        {note.title}
                      </Typography>
                      {note.my_note && (
                        <Typography
                          variant="caption"
                          sx={{
                            bgcolor: '#8e24aa',
                            color: '#fff',
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 2,
                            fontWeight: 600,
                            fontSize: '0.8rem',
                            ml: 1,
                            boxShadow: 1,
                            letterSpacing: 1,
                          }}
                        >
                          My Note
                        </Typography>
                      )}
                    </Box>
                    <Box
                      sx={{
                        mt: 2,
                        color: '#8e24aa',
                        fontSize: '1rem',
                        wordBreak: 'break-word',
                        whiteSpace: 'pre-line',
                        overflowWrap: 'break-word',
                        width:250,
                        maxHeight: 120, // fixed max height for description
                        overflowY: 'auto', // scrollable if too long
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