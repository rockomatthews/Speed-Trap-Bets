// src/components/SignUp.js
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Button, TextField, Box, Typography, Grid, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      console.error('Error signing up:', error.message);
      setSnackbarMessage('Error signing up: ' + error.message);
      setShowSnackbar(true);
    } else {
      setSnackbarMessage('Sign up successful! Please check your email to verify your account.');
      setShowSnackbar(true);
    }
  };

  const handleGoogleSignUp = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) {
      console.error('Error signing up with Google:', error.message);
      setSnackbarMessage('Error signing up with Google: ' + error.message);
      setShowSnackbar(true);
    }
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
      <Snackbar
        open={showSnackbar}
        autoHideDuration={6000}
        onClose={() => setShowSnackbar(false)}
      >
        <Alert onClose={() => setShowSnackbar(false)} severity="info" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default SignUp;
