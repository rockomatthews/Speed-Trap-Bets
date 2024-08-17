import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function App() {
  return (
    <Box
      sx={{
        height: '100vh',
        backgroundColor: 'background.default',
        color: 'text.primary',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >

      <Typography variant="h4" component="h1">
        Edit <code>src/App.js</code> and save to reload.
      </Typography>
      <Typography
        variant="body1"
        component="a"
        href="https://reactjs.org"
        target="_blank"
        rel="noopener noreferrer"
        sx={{ color: 'text.primary', marginTop: 2 }}
      >
        Learn React
      </Typography>
    </Box>
  );
}

export default App;
