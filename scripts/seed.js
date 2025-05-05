require('dotenv').config();
const mongoose = require('mongoose');
const Student = require('../src/models/Student');
const Subject = require('../src/models/Subject');
const { connectToDatabase } = require('../src/config/database');

const students = [
  { name: "Alice Johnson", program: "Software Engineering" },
  { name: "Bob Smith", program: "Software Engineering" },
  { name: "Charlie Brown", program: "Software Engineering" },
  { name: "Diana Prince", program: "Software Engineering" },
  { name: "Ethan Hunt", program: "Software Engineering" },
  { name: "Fiona Gallagher", program: "Software Engineering" },
  { name: "George Costanza", program: "Software Engineering" },
  { name: "Hannah Baker", program: "Software Engineering" },
  { name: "Ian Malcolm", program: "Software Engineering" },
  { name: "Julia Roberts", program: "Software Engineering" }
];

const subjects = [
  { name: "Introduction to Programming", year: 1 },
  { name: "Data Structures", year: 1 },
  { name: "Database Systems", year: 2 },
  { name: "Software Engineering Principles", year: 2 },
  { name: "Web Development", year: 3 },
  { name: "Mobile Application Development", year: 3 },
  { name: "Software Testing", year: 4 },
  { name: "Project Management", year: 4 },
  { name: "Cloud Computing", year: 4 },
  { name: "Artificial Intelligence", year: 4 }
];

async function seedDatabase() {
  try {
    // Wait for database connection
    await connectToDatabase();
    console.log('Connection established, seeding database...');
    
    // Clear existing data
    await Student.deleteMany({});
    await Subject.deleteMany({});

    // Insert new data
    await Student.insertMany(students);
    await Subject.insertMany(subjects);

    console.log('Database seeded successfully!');
    await mongoose.disconnect(); // Properly close connection
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();