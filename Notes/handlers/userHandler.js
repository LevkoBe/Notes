const { User } = require("../models");

async function saveUserInDatabase(name, lastname, email, password) {
    try {
        const user = new User({ name, lastname, email, password });
        await user.save();
        return user;
    } catch (error) {
        throw error;
    }
}

async function updateUserInDatabase(userId, userObj) {
    try {
        await User.findByIdAndUpdate(userId, userObj);
    } catch (error) {
        throw error;
    }
}

async function updateUserfieldInDatabase(userId, updatedFields) {
    try {
        await User.findByIdAndUpdate(userId, { $set: updatedFields });
    } catch (error) {
        throw error;
    }
}

module.exports = {
    saveUserInDatabase,
    updateUserInDatabase,
    updateUserfieldInDatabase,
};
