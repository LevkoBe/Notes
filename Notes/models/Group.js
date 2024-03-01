const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
    name: { type: String, required: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User;'},
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    dashboard: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder' },
    createdAt: { type: Date, default: Date.now }
});

const Group = mongoose.model('Group', GroupSchema);

module.exports = {
    GroupSchema: GroupSchema,
    Group: Group,
}
