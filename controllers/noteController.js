const { Note, Folder } = require('../models');

async function createNoteController(req, res) {
    try {
        const { title, content, importance, assignees, duration, startsAt } = req.body;
        const folderId = req.params.folderId;
        const userId = req.params.userId;

        const newNote = new Note({
            title,
            content,
            folderId,
            importance,
            assignees,
            duration,
            startsAt
        });

        const savedNote = await newNote.save();
        await Folder.findOneAndUpdate(
            { _id: folderId },
            { $push: { notes: savedNote._id } }
        );
        // res.status(201).json(savedNote);
        res.status(201).redirect(`/users/${userId}/${folderId}`);
    } catch (error) {
        console.error('Error creating Note:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = {
    createNoteController
};
