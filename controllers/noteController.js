const { Note, Folder, User } = require('../models');
const axios = require('axios');

async function allUserNotes(req, res) {
    try {
        const userId = req.userId.userId;
        const user = await User.findById(userId);
        const notes = await Note.find({owner: userId});
        res.render('notes-list', { notes, user });
    } catch (error) {
        console.error('Error fetching notes:', error);
        res.status(500).render('error', { message: 'Internal Server Error', status: 500 });
    }
}

async function oneNoteController(req, res) {
    try {
        const noteId = req.params.id;
        const note = await Note.findById(noteId);
        res.render('note', { note });
    } catch (error) {
        console.error('Error creating Note:', error);
        res.status(500).render('error', { message: 'Internal Server Error', status: 500 });
    }
}

async function createNoteController(req, res) {
    try {
        const { title, content, importance, assignees, duration, startsAt } = req.body;
        const folderId = req.params.folderId;
        const userId = req.params.userId;

        const newNote = new Note({
            owner: userId,
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
        res.status(500).render('error', { message: 'Internal Server Error', status: 500 });
    }
}

async function randomNote(req, res) {
    try {
        const userId = req.userId.userId;
        const notes = await Note.find({owner: userId});
        const noteTitles = notes.map(note => note.title);
        
        const djangoResponse = await axios.post('http://127.0.0.1:8000/random-note', {
            "note_titles": noteTitles
        });
        
        const randomNote = djangoResponse.data;
        return res.status(200).send(randomNote);
    } catch (err) {
        return res.status(500).send(err);
    }
}


module.exports = {
    oneNoteController,
    createNoteController,
    randomNote,
    allUserNotes
};
