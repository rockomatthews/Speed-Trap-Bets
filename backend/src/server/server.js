// Load environment variables from the .env file
require('dotenv').config();

// Import necessary modules
const express = require('express'); // Express is a web framework for Node.js
const cors = require('cors'); // CORS middleware for handling cross-origin requests
const bodyParser = require('body-parser'); // Body-parser middleware to parse incoming request bodies
const iRacingApi = require('./iRacingApi'); // Import the iRacing API module

// Create an instance of the Express application
const app = express();

// Use CORS middleware to enable cross-origin requests
app.use(cors());

// Use body-parser middleware to parse JSON request bodies
app.use(bodyParser.json());

// Define API route for authentication with the iRacing API
app.post('/api/authenticate', async (req, res) => {
  console.log('Received POST request to /api/authenticate');
  try {
    const cookies = await iRacingApi.authenticate();
    console.log('Authentication successful, sending cookies...');
    res.json({ cookies });
  } catch (error) {
    console.error('Error during authentication:', error.message);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

// Start the server and listen on the specified port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
