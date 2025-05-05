const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
const studentRoutes = require('../routes/studentRoutes');
const subjectRoutes = require('../routes/subjectRoutes');

app.use('/students', studentRoutes);
app.use('/subjects', subjectRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});