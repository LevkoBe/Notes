const router = require('express').Router();
const registrationController = require('../controllers/registrationController');

router.route('/new')
    .get(registrationController.getCreateUserForm)
    .post(registrationController.createUser);

router.route('/login')
    .get(registrationController.loginController)
    .post(registrationController.loginController);

module.exports = router;