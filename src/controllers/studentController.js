const Student = require('../models/Student');

class StudentController {
  async getAllStudents(req, res) {
    try {
      const students = await Student.find();
      // Format response to match test expectations
      const formattedStudents = students.map(student => ({
        name: student.name,
         enrolledProgram: student.program
       }));
       // Send the array directly to match frontend expectation
       res.json(formattedStudents);
     } catch (error) {
       res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new StudentController();
