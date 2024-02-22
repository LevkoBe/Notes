const router = require('express').Router();
const folderController = require('../controllers/folderController');

router.post('/:userId/:folderId', folderController.createFolderController);

module.exports = router;
