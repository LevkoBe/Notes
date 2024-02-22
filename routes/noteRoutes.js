const router = require('express').Router();
const noteController = require('../controllers/noteController');

router.post('/:userId/:folderId', noteController.createNoteController);

module.exports = router;
