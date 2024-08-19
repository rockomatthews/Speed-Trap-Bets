const axios = require('axios');
const CryptoJS = require('crypto-js');
const supabase = require('./supabaseClient'); // Import the Supabase client

const IRACING_EMAIL = process.env.IRACING_EMAIL;
const IRACING_PASSWORD = process.env.IRACING_PASSWORD;
let ssoCookie = null; // Store SSO cookie globally to manage sessions

// Function to encode the password using SHA256 and Base64
const encodePassword = (email, password) => {
  const normalizedEmail = email.toLowerCase();
  const hash = CryptoJS.SHA256(password + normalizedEmail);
  return CryptoJS.enc.Base64.stringify(hash);
};

// Function to authenticate with the iRacing API
const authenticate = async () => {
  try {
    console.log('Attempting to authenticate with iRacing API...');
    const passwordHash = encodePassword(IRACING_EMAIL, IRACING_PASSWORD);

    const body = {
      email: IRACING_EMAIL,
      password: passwordHash,
    };

    const response = await axios.post('https://members-ng.iracing.com/auth', body, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.data && response.data.ssoCookieValue) {
      ssoCookie = response.data.ssoCookieValue;
      console.log('Authenticated with iRacing, SSO cookie saved:', ssoCookie);
    } else {
      console.warn('Authentication succeeded but no SSO cookie was received.');
    }

    return ssoCookie;
  } catch (error) {
    console.error('Error during authentication:', error.message);
    throw new Error('Failed to authenticate with iRacing');
  }
};

// Function to clear cookies manually
const clearCookies = () => {
  ssoCookie = null;
  console.log('SSO cookie cleared.');
};

// Function to refresh authentication periodically
const refreshAuthentication = async () => {
  try {
    console.log('Attempting to refresh iRacing authentication...');
    await authenticate();
    console.log('Authentication refreshed successfully.');
  } catch (error) {
    console.error('Error refreshing iRacing authentication:', error.message);
  }
};

// Function to search for a driver by name in the iRacing API
const searchDriver = async (name) => {
  try {
    if (!ssoCookie) {
      console.log('No valid SSO cookie found, attempting to authenticate...');
      await authenticate();
    }

    console.log(`Searching for driver with name: ${name}`);
    const response = await axios.get('https://members-ng.iracing.com/data/member/get', {
      headers: {
        Cookie: `irsso_membersv2=${ssoCookie}`,
      },
      params: {
        cust_ids: name, // Use the correct parameter to search by name
        include_licenses: false,
      },
    });

    console.log('Driver search completed.');
    return response.data[0]; // Adjust based on actual response structure
  } catch (error) {
    clearCookies(); // Clear cookies in case of an error and re-attempt the authentication
    console.error('Error searching for driver:', error.message);
    throw new Error('Failed to search for driver');
  }
};

// Function to save a new user to the Users table in Supabase
const saveUser = async (email, passwordHash) => {
  try {
    console.log(`Attempting to save user with email: ${email}`);
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
const saveDriverSearchResult = async (searchTerm, result) => {
  try {
    console.log(`Attempting to save driver search result for term: ${searchTerm}`);
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
