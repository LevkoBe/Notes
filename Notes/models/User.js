const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    achievements: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reward' }],
    dashboard: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder' },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

const User = mongoose.model('User', UserSchema);

module.exports = {
    UserSchema: UserSchema,
    User: User,
}
