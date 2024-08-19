const axios = require('axios');
const CryptoJS = require('crypto-js');

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
    const emailLower = IRACING_EMAIL.toLowerCase();
    const encodedPassword = encodePassword(IRACING_EMAIL, IRACING_PASSWORD);

    const body = {
      email: emailLower,
      password: encodedPassword,
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

// Export the authenticate function
module.exports = {
  authenticate,
};
