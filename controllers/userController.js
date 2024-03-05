const {User, Note} = require('../models');
const bcrypt = require('bcrypt');
const saltRounds = 10;

async function getAllUsers(req, res) {
    try {
        const users = await User.find();
        res.render('users-list', { users });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).render('error', { message: 'Error fetching users', status: 500 });
    }
}

async function getUserInfo(req, res) {
    const userId = req.params.id;
    try {
        const user = await User.findById(userId);
        const notes = await Note.find({owner: userId});
        if (!user) throw new Error('User not found');
        res.render('user-info', { user, notes });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(404).render('error', { message: 'User not found', status: 404 });
    }
}

async function updateUser(req, res) {
    const userId = req.params.id;
    const { username, email, password } = req.body;
    try {
        let updateFields = { username, email };
        
        if (password) {
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            updateFields.password = hashedPassword;
        }
        
        await User.findByIdAndUpdate(userId, updateFields);
        res.redirect(`/users/${userId}`);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).render('error', { message: 'Error updating the user', status: 500 });
    }
}


async function deleteUser(req, res) {
    const userId = req.params.id;
    try {
        await User.findByIdAndDelete(userId);
        res.redirect('/logout');
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).render('error', { message: 'Error deleting the user', status: 500 });
    }
}

async function getEditUserForm(req, res) {
    const userId = req.params.id;
    try {
        const user = await User.findById(userId);
        if (!user) throw new Error('User not found');
        res.render('edit-user', { user });
    } catch (error) {
        console.error('Error fetching user for edit:', error);
        res.status(404).render('error', { message: 'User to be edited was not found', status: 404 });
    }
}

async function addFriend(req, res) {
    try {
        const userId = req.userId.userId;
        const user = await User.findById(userId);
        const friendId = req.body.friendId;

        const friendExists = await User.exists({ _id: friendId });
        if (!friendExists) {
            return res.status(404).render('error', { message: 'Friend not found', status: 404 });
        }

        if (userId === friendId) {
            return res.status(400).render('error', { message: "Why do you think that you're a friend of yourself?", status: 400 });
        }

        if (user.friends.includes(friendId)) {
            return res.status(400).render('error', { message: 'Friend already added', status: 400 });
        }

        await User.findByIdAndUpdate(userId, { $push: { friends: friendId } }, { new: true });
        await User.findByIdAndUpdate(friendId, { $push: { friends: userId } }, { new: true });

        res.status(200).redirect('/');
    } catch (error) {
        console.error('Error adding friend:', error);
        res.status(500).render('error', { message: 'Error adding friend', status: 500 });
    }
}


module.exports = {
    getAllUsers,
    getUserInfo,
    updateUser,
    deleteUser,
    getEditUserForm,
    addFriend
};
