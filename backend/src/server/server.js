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
app.use(express.static(path.join(__dirname, '../build')));

// Define API route for authentication with the iRacing API
app.post('/api/authenticate', async (req, res) => {
  console.log('Received POST request to /api/authenticate');
  try {
    const cookies = await iRacingApi.authenticate();
    res.json({ cookies });
  } catch (error) {
    console.error('Error during authentication:', error.message);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

// Define API route to search for a driver in the iRacing API
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

// Define API route to retrieve car data
app.get('/api/get-cars', async (req, res) => {
  try {
    const cars = await iRacingApi.getCars();
    res.json(cars);
  } catch (error) {
    console.error('Error retrieving car data:', error.message);
    res.status(500).json({ error: 'Failed to retrieve car data' });
  }
});

// Define API route to retrieve track data
app.get('/api/get-tracks', async (req, res) => {
  try {
    const tracks = await iRacingApi.getTracks();
    res.json(tracks);
  } catch (error) {
    console.error('Error retrieving track data:', error.message);
    res.status(500).json({ error: 'Failed to retrieve track data' });
  }
});

// Define API route to retrieve member information
app.get('/api/get-member-info', async (req, res) => {
  try {
    const memberInfo = await iRacingApi.getMemberInfo();
    res.json(memberInfo);
  } catch (error) {
    console.error('Error retrieving member information:', error.message);
    res.status(500).json({ error: 'Failed to retrieve member information' });
  }
});

// Define API route to retrieve session results
app.get('/api/get-session-results', async (req, res) => {
  try {
    const { subsession_id } = req.query;
    const results = await iRacingApi.getSessionResults(subsession_id);
    res.json(results);
  } catch (error) {
    console.error('Error retrieving session results:', error.message);
    res.status(500).json({ error: 'Failed to retrieve session results' });
  }
});

// Define API route to handle user sign-up
app.post('/api/signup', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Sign up user using Supabase Auth
    const { user, session, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      console.error('Error during Supabase Auth sign-up:', authError.message);
      return res.status(500).json({ error: 'Failed to sign up user with Supabase Auth' });
    }

    // Insert the new user into the Users table
    const { data, error: insertError } = await supabase
      .from('Users')
      .insert([{ email, user_id: user.id, created_at: new Date() }]);

    if (insertError) {
      console.error('Error saving user to Users table:', insertError.message);
      return res.status(500).json({ error: 'Failed to save user in Users table' });
    }

    console.log('User saved to Users table:', data);

    // Send the user data back in the response
    res.json(data);
  } catch (error) {
    console.error('Error during sign-up:', error.message);
    res.status(500).json({ error: 'Failed to sign up user' });
  }
});

// Catch-all route that returns the React app for any other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'));
});

// Define the port on which the server will listen
const PORT = process.env.PORT || 5000;

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
