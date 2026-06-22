require('dotenv').config();
const mongoose = require('mongoose');

(async () => {
  try {
    const uri = process.env.MONGODB_ATLAS_URI || process.env.MONGODB_URI;
    console.log('Testing URI:', uri);
    await mongoose.connect(uri);
    const dbs = await mongoose.connection.db.admin().listDatabases();
    console.log('Databases:', dbs.databases.map(d => d.name));
    await mongoose.connection.close();
  } catch (err) {
    console.error(err);
  }
})();