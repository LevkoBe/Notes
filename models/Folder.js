const mongoose = require('mongoose');

const FolderSchema = new mongoose.Schema({
    name: { type: String, required: true },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder' },
    notes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Note' }],
    subfolders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Folder' }],
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
});

const Folder = mongoose.model('Folder', FolderSchema);

module.exports = {
    FolderSchema: FolderSchema,
    Folder: Folder,
}
