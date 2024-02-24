const router = require('express').Router();
const homeController = require('../controllers/homeController');

router.get('/chat', homeController.chatController);
router.get('/', homeController.renderHomePage);
router.get('/logout', homeController.logoutController);

module.exports = router;
