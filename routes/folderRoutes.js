const router = require('express').Router();
const folderController = require('../controllers/folderController');

router.get('/', folderController.getAllFolders);
router.post('/:userId/:folderId', folderController.createFolderController);

module.exports = router;
