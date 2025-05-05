const express = require('express');
const path = require('path');
const studentRoutes = require('./routes/studentRoutes');
const subjectRoutes = require('./routes/subjectRoutes');
const errorHandler = require('./middleware/errorHandler');
const { connectToDatabase } = require('./config/database');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// REMOVED: app.use(express.static(path.join(__dirname, '../public'))); // Serve static files

// Connect to the database
connectToDatabase();

// Routes
app.use('/api/students', studentRoutes); // Prefix API routes
app.use('/api/subjects', subjectRoutes); // Prefix API routes

// REMOVED: Root route handler for UI
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, '../public/index.html'));
// });

// Error handling middleware
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app; // Export for testing
