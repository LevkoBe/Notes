const mongoose = require('mongoose');

const RewardSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, enum: ['common', 'Legendary', 'epic'], default: 'common' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    votes: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

const Reward = mongoose.model('Reward', RewardSchema);

module.exports = {
    RewardSchema: RewardSchema,
    Reward: Reward,
}
