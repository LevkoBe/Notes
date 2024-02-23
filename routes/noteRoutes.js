const router = require('express').Router();
const noteController = require('../controllers/noteController');

router.get('/:id', noteController.oneNoteController);
router.post('/:userId/:folderId', noteController.createNoteController);

module.exports = router;
