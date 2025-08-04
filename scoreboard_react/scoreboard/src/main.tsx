import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App.jsx'

// Define your custom theme
const theme = createTheme({
  palette: {
    mode: 'light', // or 'dark'
    primary: {
      main: '#CC0605', // Deep Purple
    },
    secondary: {
      main: '#ff5722', // Deep Orange
    },
    background: {
      default: '#f4f4f4',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial',
  },
});

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <App />
  </ThemeProvider>
);
