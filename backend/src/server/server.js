require('dotenv').config();

const express = require('express');
const path = require('path');
const axios = require('axios');
const bodyParser = require('body-parser');
const iRacingApi = require('./iRacingApi'); // Updated import path

const app = express();
app.use(bodyParser.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../../build')));

// API routes
app.post('/api/authenticate', async (req, res) => {
  try {
    const cookies = await iRacingApi.authenticate();
    res.json({ cookies });
  } catch (error) {
    console.error('Error during authentication:', error.message);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

app.get('/api/search-driver', async (req, res) => {
  try {
    const { name } = req.query;
    const driver = await iRacingApi.searchDriver(name);
    res.json(driver);
  } catch (error) {
    console.error('Error searching for driver:', error.message);
    res.status(500).json({ error: 'Failed to search for driver' });
  }
});

// Catch all other routes and return the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../build/index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
