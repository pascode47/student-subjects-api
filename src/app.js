const express = require('express');
const studentRoutes = require('./routes/studentRoutes');
const subjectRoutes = require('./routes/subjectRoutes');
const errorHandler = require('./middleware/errorHandler');
const { connectToDatabase } = require('./config/database');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to the database
connectToDatabase();

// Routes - don't call as functions
app.use('/students', studentRoutes);
app.use('/subjects', subjectRoutes);

// Error handling middleware
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app; // Export for testing