import React from 'react';
import { useForm } from 'react-hook-form';
import { signup } from '../../utils/api';
import { useRouter } from 'next/router';
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Paper,
  CircularProgress,
} from '@mui/material';

const roles = [
  { value: 'user', label: 'User' },
  { value: 'admin', label: 'Admin' },
];

export default function SignupForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const router = useRouter();
  const [errorMsg, setErrorMsg] = React.useState('');

  const onSubmit = async (data) => {
    setErrorMsg('');
    try {
      await signup(data);
      router.push('/auth/login');
    } catch (err) {
      setErrorMsg(err?.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
      }}
    >
      <Paper
        elevation={4}
        sx={{
          p: 0,
          width: { xs: '95%', sm: 400 },
          borderRadius: 4,
          overflow: 'hidden',
          boxShadow: 6,
        }}
      >
        {/* Gradient Header */}
        <Box
          sx={{
            py: 3,
            px: 2,
            background: 'linear-gradient(90deg, #1976d2 0%, #64b5f6 100%)',
            textAlign: 'center',
          }}
        >
          <Typography
            variant="h4"
            sx={{
              color: 'white',
              fontWeight: 'bold',
              letterSpacing: 1,
            }}
          >
            Create Account
          </Typography>
        </Box>

        {/* Form Section */}
        <Box sx={{ p: 3 }}>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <TextField
              label="Name"
              fullWidth
              margin="normal"
              {...register('name', { required: 'Name is required' })}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
            <TextField
              label="Phone Number"
              fullWidth
              margin="normal"
              {...register('phone', { required: 'Phone Number is required' })}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              {...register('email', { required: 'Email is required' })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 chars' } })}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            <TextField
              select
              label="Role"
              fullWidth
              margin="normal"
              defaultValue="user"
              {...register('role', { required: 'Role is required' })}
              error={!!errors.role}
              helperText={errors.role?.message}
            >
              {roles.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            {errorMsg && (
              <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                {errorMsg}
              </Typography>
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              disabled={isSubmitting}
              startIcon={isSubmitting && <CircularProgress size={20} />}
            >
              {isSubmitting ? 'Signing Up...' : 'Sign Up'}
            </Button>
          </form>
          <Typography align="center" sx={{ mt: 2 }}>
            Already have an account? <a href="/auth/login">Login</a>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}