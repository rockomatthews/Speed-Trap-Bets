// src/server/iRacingApi.js
const axios = require('axios');
const CryptoJS = require('crypto-js');

const IRACING_EMAIL = process.env.IRACING_EMAIL;
const IRACING_PASSWORD = process.env.IRACING_PASSWORD;

const authenticate = async () => {
  const passwordHash = await encodePassword(IRACING_EMAIL, IRACING_PASSWORD);
  const response = await axios.post('https://members-ng.iracing.com/auth', {
    email: IRACING_EMAIL,
    password: passwordHash,
  });
  const cookies = response.headers['set-cookie'];
  return cookies;
};

const encodePassword = (email, password) => {
  const normalizedEmail = email.toLowerCase();
  const hash = CryptoJS.SHA256(password + normalizedEmail);
  return CryptoJS.enc.Base64.stringify(hash);
};

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
    console.error('Error searching driver:', error.message);
    throw new Error('Failed to search for driver');
  }
};

module.exports = {
  authenticate,
  searchDriver,
};
