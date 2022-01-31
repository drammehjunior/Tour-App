const express = require('express');
const viewsController = require('../controllers/viewController');

const router = express.Router();


router.get('/', viewsController.getOverview);
router.get('/tour/:slug', viewsController.getTour);
router.get('/login', viewsController.login);

// 1) /login
// 2) controller
// 3) template

module.exports = router;