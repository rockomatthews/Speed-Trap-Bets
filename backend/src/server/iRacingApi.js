// src/server/iRacingApi.js
const axios = require('axios');
const CryptoJS = require('crypto-js');
const supabase = require('./supabaseClient'); // Import the Supabase client

const IRACING_EMAIL = process.env.IRACING_EMAIL;
const IRACING_PASSWORD = process.env.IRACING_PASSWORD;

// Function to authenticate with the iRacing API
const authenticate = async () => {
  try {
    const passwordHash = await encodePassword(IRACING_EMAIL, IRACING_PASSWORD);
    const response = await axios.post('https://members-ng.iracing.com/auth', {
      email: IRACING_EMAIL,
      password: passwordHash,
    });
    const cookies = response.headers['set-cookie'];
    return cookies;
  } catch (error) {
    console.error('Error during authentication:', error.message);
    throw new Error('Failed to authenticate with iRacing');
  }
};

// Function to encode the password using SHA256 and Base64
const encodePassword = (email, password) => {
  const normalizedEmail = email.toLowerCase();
  const hash = CryptoJS.SHA256(password + normalizedEmail);
  return CryptoJS.enc.Base64.stringify(hash);
};

// Function to search for a driver by name in the iRacing API
const searchDriver = async (name) => {
  try {
    const cookies = await authenticate();
    const response = await axios.get('https://members-ng.iracing.com/data/member/get', {
      headers: {
        Cookie: cookies.join('; '),
      },
      params: {
        cust_ids: name, // Replace with correct parameter to search by name
        include_licenses: false,
      },
    });
    return response.data[0]; // Adjust based on actual response structure
  } catch (error) {
    console.error('Error searching for driver:', error.message);
    throw new Error('Failed to search for driver');
  }
};

// Function to save a new user to the Users table in Supabase
const saveUser = async (email, passwordHash) => {
  try {
    const { data, error } = await supabase
      .from('Users')
      .insert([
        { email, password_hash: passwordHash }
      ]);

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
const saveDriverSearchResult = async (searchTerm, result) => {
  try {
    const { data, error } = await supabase
      .from('DriverSearchCache')
      .insert([
        { search_term: searchTerm, result }
      ]);

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

module.exports = {
  authenticate,
  searchDriver,
  saveUser,
  saveDriverSearchResult,
};
