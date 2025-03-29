const Student = require('../models/Student');

class StudentController {
  async getAllStudents(req, res) {
    try {
      const students = await Student.find();
      res.json(students);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new StudentController();