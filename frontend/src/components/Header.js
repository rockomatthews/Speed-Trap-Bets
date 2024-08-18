import React from 'react';
import { AppBar, Toolbar, IconButton, Button, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const Header = () => {
  return (
    <AppBar position="fixed" sx={{ backgroundColor: '#000000' }}>
      <Toolbar>
        {/* Hamburger Menu Icon */}
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>

        {/* Title or Logo Placeholder */}
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Dashboard
        </Typography>

        {/* Connect Wallet Button */}
        <Button
          variant="contained"
          sx={{
            backgroundColor: '#000',
            color: '#fde100',
            '&:hover': {
              backgroundColor: '#333', // Darken on hover
            },
          }}
        >
          Connect Wallet
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
