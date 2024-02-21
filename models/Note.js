const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    folderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder' },
    createdAt: { type: Date, default: Date.now },
    importance: { type: Number, default: 0 },
    assignees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    duration: { type: Number }, // Assuming duration in minutes
    startsAt: { type: Date },
    completed: { type: Boolean, default: false },
    nominations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reward' }]
});

const Note = mongoose.model('Note', NoteSchema);

module.exports = {
    NoteSchema: NoteSchema,
    Note: Note,
}
