import React from 'react';
import { useForm } from 'react-hook-form';
import { login } from '../../utils/api';
import { setToken } from '../../utils/auth';
import { useRouter } from 'next/router';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress,
} from '@mui/material';

export default function LoginForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const router = useRouter();
  const [errorMsg, setErrorMsg] = React.useState('');

  const onSubmit = async (data) => {
    setErrorMsg('');
    try {
      const res = await login(data);
      console.log(res?.data?.data);
      const role = res?.data?.data?.user?.role;
      const token = res?.data?.data?.access_token;
      setToken(token);
      localStorage.setItem('role', role);
      if (role === 'admin') {
        router.push('/dashboard/admin');
      } else {
        router.push('/dashboard/user');
      }
    } catch (err) {
      setErrorMsg(err?.response?.data?.message || 'Login failed');
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
            Login
          </Typography>
        </Box>
        <Box sx={{ p: 3 }}>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
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
              {...register('password', { required: 'Password is required' })}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
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
              {isSubmitting ? 'Logging In...' : 'Login'}
            </Button>
          </form>
          <Typography align="center" sx={{ mt: 2 }}>
            Don't have an account? <a href="/auth/signup" style={{ color: '#1976d2', fontWeight: 600 }}>Sign Up</a>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}