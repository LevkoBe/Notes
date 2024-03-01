const router = require('express').Router();
const homeController = require('../controllers/homeController');

router.get('/', homeController.renderHomePage);
router.get('/logout', homeController.logoutController);
router.get('/friends', homeController.friendsPage);
router.get('/dashboard', homeController.renderDashboard);

module.exports = router;
