// src/components/SignUp.js
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Button, TextField, Box, Typography, Grid } from '@mui/material';

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) console.error('Error signing up:', error.message);
    else console.log('Signed up successfully');
  };

  const handleGoogleSignUp = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) console.error('Error signing up with Google:', error.message);
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
            Sign Up
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
            onClick={handleSignUp}
            sx={{ py: 1.5 }}
          >
            Sign Up
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button
            fullWidth
            variant="outlined"
            color="secondary"
            onClick={handleGoogleSignUp}
            sx={{ py: 1.5 }}
          >
            Sign Up with Google
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default SignUp;
