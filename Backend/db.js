const mongoose = require('mongoose');
require('dotenv').config();

function maskUri(uri) {
  if (!uri) return uri;
  return uri.replace(/(\/\/.*:)(.*)(@)/, '$1*****$3');
}

const connectDB = async () => {
  const uri = process.env.MONGODB_ATLAS_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/recyclens';

  if (!process.env.MONGODB_ATLAS_URI && !process.env.MONGODB_URI) {
    console.warn('No MONGODB_ATLAS_URI or MONGODB_URI set; using local fallback:', uri);
  } else {
    console.log('Attempting MongoDB connection to:', maskUri(uri));
  }

  try {
    await mongoose.connect(uri);
    console.log(`MongoDB connected (${uri.startsWith('mongodb+srv') ? 'Atlas' : 'Local'})`);
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    if (err.message.includes('ECONNREFUSED')) {
      console.error('- Connection refused: is a local MongoDB running at 127.0.0.1:27017?');
      console.error('- Or your .env may still have a local URI; check `Backend/.env`.');
    }
    if (err.message.includes('Authentication failed') || err.message.includes('bad auth')) {
      console.error('- Authentication failed: check Atlas Database Access user/password.');
    }
    if (err.message.includes('ENOTFOUND') || err.message.includes('getaddrinfo')) {
      console.error('- DNS/SRV resolution failed: ensure your network allows DNS SRV lookups.');
    }
    throw err;
  }
};

module.exports = connectDB;