import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#8e24aa', // purple
      light: '#ce93d8',
      dark: '#6d1b7b',
      contrastText: '#fff',
    },
    secondary: {
      main: '#1976d2', // blue
      light: '#64b5f6',
      dark: '#1565c0',
      contrastText: '#fff',
    },
    background: {
      default: '#f5faff',
      paper: '#fff',
    },
    error: {
      main: '#d32f2f',
    },
  },
  shape: {
    borderRadius: 16,
  },
  typography: {
    fontFamily: 'Inter, Roboto, Arial, sans-serif',
    h3: {
      fontWeight: 800,
      letterSpacing: 2,
    },
    h6: {
      fontWeight: 700,
    },
    button: {
      fontWeight: 700,
    },
  },
});

export default theme;