import React from 'react';
import { supabase } from '../supabaseClient';
import { Button, Box, Typography } from '@mui/material';

function Dashboard() {
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Error logging out:', error.message);
    else console.log('Logged out successfully');
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <Typography variant="h4">Welcome to the Dashboard!</Typography>
      <Button variant="contained" onClick={handleLogout}>
        Log Out
      </Button>
    </Box>
  );
}

export default Dashboard;
