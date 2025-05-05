const Subject = require('../models/Subject');

class SubjectController {
  async getAllSubjects(req, res) {
    try {
      const subjects = await Subject.find().sort({ year: 1 });
      res.json({ subjects: subjects });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new SubjectController();