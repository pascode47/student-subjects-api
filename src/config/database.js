const mongoose = require('mongoose');

const connectToDatabase = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/student-subjects-api';
    
    // Add explicit connection options
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 15000, // Increase timeout
      socketTimeoutMS: 45000,
    });
    
    // Return the connection for better handling
    return mongoose.connection;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit with failure
  }
};

module.exports = {
  connectToDatabase,
  mongoose
};

//net start mongodb