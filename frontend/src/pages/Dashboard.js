import React from 'react';
import { supabase } from '../supabaseClient';
import Header from '../components/Header';
import { Box } from '@mui/material';

function Dashboard() {
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Error logging out:', error.message);
    else console.log('Logged out successfully');
  };

  return (
    <Box>
      <Header />
      {/* Main content area with top padding to prevent overlap with the fixed header */}
      <Box
        sx={{
          marginTop: '64px', // Adjust based on the height of the AppBar (default 64px for regular AppBar)
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        {/* Content goes here */}
      </Box>
    </Box>
  );
}

export default Dashboard;
