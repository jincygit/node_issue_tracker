const express = require('express');

const router = express.Router();
const homeController = require('../controllers/home_controller');

console.log('router loaded');


router.use('/project', require('./project'));
router.use('/issues', require('./issues'));




// for any further routes, access from here
// router.use('/routerName', require('./routerfile));


module.exports = router;