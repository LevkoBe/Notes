const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    content: { type: String, required: true },
    noteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Note' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
});

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = {
    CommentSchema: CommentSchema,
    Comment: Comment,
}
