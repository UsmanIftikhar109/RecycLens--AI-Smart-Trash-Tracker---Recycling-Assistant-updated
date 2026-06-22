require('dotenv').config();
const mongoose = require('mongoose');

(async () => {
  try {
    const uri = process.env.MONGODB_ATLAS_URI || process.env.MONGODB_URI;
    console.log('Testing URI:', uri);
    await mongoose.connect(uri); // no options object
    console.log('Connected to', uri && uri.startsWith('mongodb+srv') ? 'Atlas' : 'MongoDB');
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('Connection error:', err.message);
    console.error(err);
    process.exit(1);
  }
})();