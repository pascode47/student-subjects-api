const express = require('express');
const subjectController = require('../controllers/subjectController');

const router = express.Router();

router.get('/', subjectController.getAllSubjects);

module.exports = router;