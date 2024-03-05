const { Note, Folder, User } = require('../models');
const axios = require('axios');

async function allUserNotes(req, res) {
    try {
        const userId = req.userId.userId;
        const user = await User.findById(userId);
        const notes = await Note.find({ owner: userId });
        res.render('notes-list', { notes, user });
    } catch (error) {
        console.error('Error fetching notes:', error);
        res.status(500).render('error', { message: 'An error occured while fetching your notes', status: 500 });
    }
}

async function oneNoteController(req, res) {
    try {
        const noteId = req.params.id;
        const note = await Note.findById(noteId);
        res.render('note', { note });
    } catch (error) {
        console.error('Error fetching Note:', error);
        res.status(500).render('error', { message: 'Error fetching the note', status: 500 });
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
        res.status(201).redirect(`/users/${userId}/${folderId}`);
    } catch (error) {
        console.error('Error creating Note:', error);
        res.status(500).render('error', { message: 'Error creating the note', status: 500 });
    }
}

async function updateNote(req, res) {
    try {
        const noteId = req.params.id;
        const { title, content, importance } = req.body;
        const completed = req.body.completed === 'on';

        await Note.findByIdAndUpdate(noteId, {
            title,
            content,
            importance,
            completed
        }, { new: true });

        res.status(200).redirect(`/notes/${noteId}`);
    } catch (error) {
        console.error('Error updating Note:', error);
        res.status(500).render('error', { message: 'Error updating the note', status: 500 });
    }
}

async function randomNote(req, res) {
    try {
        const userId = req.userId.userId;
        const notes = await Note.find({ owner: userId });

        const randomIndex = Math.floor(Math.random() * notes.length);
        const randomNote = notes[randomIndex];

        return res.status(200).send(randomNote);
    } catch (error) {
        console.error('Error fetching random note:', error);
        return res.status(500).send(error);
    }
}



module.exports = {
    oneNoteController,
    createNoteController,
    updateNote,
    randomNote,
    allUserNotes
};
