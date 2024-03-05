const router = require('express').Router();
const userController = require('../controllers/userController');
const dashboardController = require('../controllers/dashboardController');

router.post('/add-friend', userController.addFriend);

router.route('/:id')
.get(userController.getUserInfo)
.put(userController.updateUser)
.delete(userController.deleteUser);

router.get('/:id/edit', userController.getEditUserForm);

router.get('/:id/:folderId', dashboardController.getUserDashboard);


module.exports = router;
