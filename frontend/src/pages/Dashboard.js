import React, { useEffect } from 'react';
import Header from '../components/Header';
import { Box } from '@mui/material';

function Dashboard() {
  useEffect(() => {
    // Authenticate with iRacing API when the component mounts
    const initAuth = async () => {
      try {
        console.log('Starting authentication process...');
        const response = await fetch('/api/authenticate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to authenticate with iRacing API');
        }

        const data = await response.json();
        console.log('Authenticated with iRacing API:', data);

        // Set up an interval to refresh the authentication every 15 minutes
        const refreshInterval = setInterval(async () => {
          try {
            console.log('Refreshing authentication...');
            await fetch('/api/authenticate', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
            });
            console.log('Refreshed iRacing API authentication');
          } catch (error) {
            console.error('Error refreshing iRacing API authentication:', error.message);
          }
        }, 15 * 60 * 1000);

        return () => clearInterval(refreshInterval);
      } catch (error) {
        console.error('Error initializing iRacing API authentication:', error.message);
      }
    };

    initAuth();
  }, []);

  return (
    <Box>
      <Header />
      <Box
        sx={{
          marginTop: '64px',
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
