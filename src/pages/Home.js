import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import LogIn from '../components/LogIn';
import SignUp from '../components/SignUp';
import { Box, Button, Typography } from '@mui/material';

function Home() {
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/dashboard');
      }
    };
    checkUser();
  }, [navigate]);

  const toggleForm = () => {
    setShowLogin(!showLogin);
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        px: 2,
      }}
    >
      {showLogin ? <LogIn /> : <SignUp />}
      <Box sx={{ mt: 2 }}>
        {showLogin ? (
          <Typography>
            Don't have an account?{' '}
            <Button variant="text" onClick={toggleForm} sx={{ color: 'primary.main' }}>
              Sign Up
            </Button>
          </Typography>
        ) : (
          <Typography>
            Already have an account?{' '}
            <Button variant="text" onClick={toggleForm} sx={{ color: 'primary.main' }}>
              Log In
            </Button>
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default Home;
