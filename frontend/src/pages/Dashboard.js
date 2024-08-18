import React, { useEffect } from 'react';
import { supabase } from '../supabaseClient';
import Header from '../components/Header';
import { Box } from '@mui/material';
import { authenticate, refreshAuthentication } from '../server/iRacingApi';

function Dashboard() {
  useEffect(() => {
    // Authenticate with the iRacing API when the component mounts
    const initAuth = async () => {
      try {
        await authenticate();
        console.log('Authenticated with iRacing API');
        
        // Set up an interval to refresh the authentication every 15 minutes
        const refreshInterval = setInterval(async () => {
          await refreshAuthentication();
        }, 15 * 60 * 1000); // 15 minutes in milliseconds

        // Clean up interval on component unmount
        return () => clearInterval(refreshInterval);
      } catch (error) {
        console.error('Error initializing iRacing API authentication:', error.message);
      }
    };

    initAuth();
  }, []);

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
