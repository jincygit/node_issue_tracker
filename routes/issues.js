const express = require('express');

const router = express.Router();
const issuesController = require('../controllers/issues_controller');


router.get('/home', issuesController.listProjects);
router.post('/filter', issuesController.issues_filtering);
router.post('/create', issuesController.create);



module.exports = router;