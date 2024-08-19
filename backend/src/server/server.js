// Load environment variables from the .env file
require('dotenv').config();

// Import the necessary modules
const express = require('express'); // Express is a web framework for Node.js
const path = require('path'); // Path is a module to handle and transform file paths
const bodyParser = require('body-parser'); // Body-parser is middleware to parse incoming request bodies
const iRacingApi = require('./iRacingApi'); // Import the iRacing API module
const supabase = require('./supabaseClient'); // Import the Supabase client

// Create an instance of the Express application
const app = express();

// Use body-parser middleware to parse JSON request bodies
app.use(bodyParser.json());

// Serve static files from the React app's build directory
app.use(express.static(path.join(__dirname, '../../frontend/build')));

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

// Define API route to search for a driver in the iRacing API
app.get('/api/search-driver', async (req, res) => {
  console.log('Received GET request to /api/search-driver');
  try {
    const { name } = req.query;
    console.log(`Searching for driver: ${name}`);
    const driver = await iRacingApi.searchDriver(name);
    console.log('Driver search successful, sending data...');
    res.json(driver);
  } catch (error) {
    console.error('Error searching for driver:', error.message);
    res.status(500).json({ error: 'Failed to search for driver' });
  }
});

// Define API route to handle user sign-up
app.post('/api/signup', async (req, res) => {
  console.log('Received POST request to /api/signup');
  try {
    const { email, password } = req.body;

    // Sign up user using Supabase Auth
    console.log(`Attempting to sign up user with email: ${email}`);
    const { user, session, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      console.error('Error during Supabase Auth sign-up:', authError.message);
      return res.status(500).json({ error: 'Failed to sign up user with Supabase Auth' });
    }

    console.log('Supabase Auth sign-up successful, inserting into Users table...');
    // Insert the new user into the Users table
    const { data, error: insertError } = await supabase
      .from('Users')
      .insert([{ email, user_id: user.id, created_at: new Date() }]);

    if (insertError) {
      console.error('Error saving user to Users table:', insertError.message);
      return res.status(500).json({ error: 'Failed to save user in Users table' });
    }

    console.log('User saved to Users table:', data);
    res.json(data);
  } catch (error) {
    console.error('Error during sign-up:', error.message);
    res.status(500).json({ error: 'Failed to sign up user' });
  }
});

// Catch-all route that returns the React app for any other routes
app.get('*', (req, res) => {
  console.log('Serving React app for unmatched route...');
  res.sendFile(path.join(__dirname, '../../frontend/build/index.html'));
});

// Define the port on which the server will listen
const PORT = process.env.PORT || 5000;

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
