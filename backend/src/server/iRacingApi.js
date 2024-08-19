// Import necessary modules
const axios = require('axios');
const CryptoJS = require('crypto-js');
const supabase = require('./supabaseClient'); // Import the Supabase client

// Load environment variables for iRacing credentials
const IRACING_EMAIL = process.env.IRACING_EMAIL;
const IRACING_PASSWORD = process.env.IRACING_PASSWORD;

// Initialize a variable to store cookies globally to manage sessions
let cookies = null;

// Function to encode the password using SHA256 and Base64
// This ensures the password is securely hashed before sending to the iRacing API
const encodePassword = (email, password) => {
  const normalizedEmail = email.toLowerCase();
  const hash = CryptoJS.SHA256(password + normalizedEmail);
  return CryptoJS.enc.Base64.stringify(hash);
};

// Function to authenticate with the iRacing API
// This function hashes the password, sends a POST request to the iRacing authentication endpoint,
// and stores the returned cookies for session management
const authenticate = async () => {
  try {
    const passwordHash = encodePassword(IRACING_EMAIL, IRACING_PASSWORD);

    // Send a POST request to the iRacing API to authenticate the user
    const response = await axios.post('https://members-ng.iracing.com/auth', {
      email: IRACING_EMAIL,
      password: passwordHash,
    });

    if (response.headers['set-cookie']) {
      // Store the cookies globally
      cookies = response.headers['set-cookie'];
      console.log('Authenticated with iRacing');
    } else {
      console.warn('Authentication succeeded but no cookies were received.');
    }

    return cookies;
  } catch (error) {
    console.error('Error during authentication:', error.message);
    throw new Error('Failed to authenticate with iRacing');
  }
};

// Function to clear cookies manually
// This is useful in situations where stale cookies might be causing authentication issues
const clearCookies = () => {
  cookies = null;
  console.log('Cookies cleared.');
};

// Function to refresh authentication periodically
// This function re-authenticates with the iRacing API to keep the session alive
const refreshAuthentication = async () => {
  try {
    await authenticate();
  } catch (error) {
    console.error('Error refreshing iRacing authentication:', error.message);
  }
};

// Function to search for a driver by name in the iRacing API
// This function checks for valid cookies, authenticates if necessary, and then performs the search
const searchDriver = async (name) => {
  try {
    if (!cookies) {
      await authenticate();
    }

    const response = await axios.get('https://members-ng.iracing.com/data/member/get', {
      headers: {
        Cookie: cookies.join('; '),
      },
      params: {
        cust_ids: name, // Use the correct parameter to search by name
        include_licenses: false,
      },
    });

    return response.data[0]; // Adjust based on actual response structure
  } catch (error) {
    clearCookies(); // Clear cookies in case of an error and re-attempt the authentication
    console.error('Error searching for driver:', error.message);
    throw new Error('Failed to search for driver');
  }
};

// Function to save a new user to the Users table in Supabase
// This function inserts the user data into the Supabase Users table and handles any errors
const saveUser = async (email, passwordHash) => {
  try {
    const { data, error } = await supabase
      .from('Users')
      .insert([{ email, password_hash: passwordHash }]);

    if (error) {
      console.error('Error saving user to Supabase:', error.message);
      throw new Error('Failed to save user');
    }

    console.log('User saved to Supabase:', data);
    return data;
  } catch (error) {
    console.error('Error during saving user:', error.message);
    throw new Error('Failed to save user');
  }
};

// Function to save driver search results to the DriverSearchCache table in Supabase
// This function caches driver search results in the Supabase database to reduce API load
const saveDriverSearchResult = async (searchTerm, result) => {
  try {
    const { data, error } = await supabase
      .from('DriverSearchCache')
      .insert([{ search_term: searchTerm, result }]);

    if (error) {
      console.error('Error saving driver search result to Supabase:', error.message);
      throw new Error('Failed to save driver search result');
    }

    console.log('Driver search result saved to Supabase:', data);
    return data;
  } catch (error) {
    console.error('Error during saving driver search result:', error.message);
    throw new Error('Failed to save driver search result');
  }
};

// Export the functions for use in other modules
module.exports = {
  authenticate,
  clearCookies,
  refreshAuthentication,
  searchDriver,
  saveUser,
  saveDriverSearchResult,
};
