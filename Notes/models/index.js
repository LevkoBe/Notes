const user = require("./User");
const group = require("./Group");
const folder = require("./Folder");
const note = require("./Note");
const reward = require("./Reward");
const comment = require("./Comment");

module.exports = {
    User: user.User,
    Group: group.Group,
    Folder: folder.Folder,
    Note: note.Note,
    Reward: reward.Reward,
    Comment: comment.Comment
}