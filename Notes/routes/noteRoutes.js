const router = require('express').Router();
const noteController = require('../controllers/noteController');

router.get('/', noteController.allUserNotes);
router.get('/random-note', noteController.randomNote);
router.get('/:id', noteController.oneNoteController);
router.put('/:id', noteController.updateNote);
router.post('/:userId/:folderId', noteController.createNoteController);

module.exports = router;
