const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
  try {
    const uri = 'mongodb://localhost:27017/student-subjects-api';
    console.log(`Testing connection to: ${uri}`);
    
    await mongoose.connect(uri, { 
      serverSelectionTimeoutMS: 5000,
      family: 4
    });
    
    console.log('✅ Connected successfully!');
    
    // List databases to confirm access
    const admin = mongoose.connection.db.admin();
    const dbs = await admin.listDatabases();
    console.log('Available databases:', dbs.databases.map(db => db.name));
    
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Connection failed:', error);
  }
}

testConnection();