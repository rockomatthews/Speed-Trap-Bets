// src/theme/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#000000', // Black background
      paper: '#000000',
    },
    text: {
      primary: '#ffffff', // White text
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h1: {
      color: '#ffffff',
    },
    h2: {
      color: '#ffffff',
    },
    body1: {
      color: '#ffffff',
    },
    body2: {
      color: '#ffffff',
    },
  },
});

export default theme;
