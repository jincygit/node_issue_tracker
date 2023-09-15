const express = require('express');

const router = express.Router();
const projectController = require('../controllers/project_controller');


router.get('/home', projectController.listProjects);
router.get('/details/:id', projectController.projectDetail);
router.post('/create', projectController.create);



module.exports = router;