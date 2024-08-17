// src/components/LogIn.js
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Button, TextField, Box, Typography, Grid } from '@mui/material';

function LogIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) console.error('Error logging in:', error.message);
    else console.log('Logged in successfully');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        px: 2,
        backgroundColor: 'background.default',
      }}
    >
      <Grid container spacing={2} maxWidth="xs">
        <Grid item xs={12}>
          <Typography variant="h4" align="center" gutterBottom>
            Log In
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Password"
            variant="outlined"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleLogin}
            sx={{ py: 1.5 }}
          >
            Log In
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button
            fullWidth
            variant="outlined"
            color="secondary"
            onClick={async () => {
              const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
              });
              if (error) console.error('Error signing in with Google:', error.message);
            }}
            sx={{ py: 1.5 }}
          >
            Sign in with Google
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default LogIn;
