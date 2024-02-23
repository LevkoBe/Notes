const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');
const dashboardController = require('../controllers/dashboardController');

router.route('/')
    .get(groupController.getAllGroups)
    .post(groupController.createGroup);

router.get('/new', groupController.getCreateGroupForm);
router.get('/:id/:folderId', dashboardController.getGroupDashboard);

router.route('/:id')
    .get(groupController.getGroupInfo)
    .put(groupController.updateGroup)
    .patch(groupController.partialUpdateGroup)
    .delete(groupController.deleteGroup);

router.get('/:id/edit', groupController.getEditGroupForm);

module.exports = router;
