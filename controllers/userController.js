const {User} = require('../models/User');
const {Folder} = require('../models/Folder');

async function getAllUsers(req, res) {
    try {
        const users = await User.find();
        res.render('users-list', { users });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).render('error', { message: 'Internal Server Error', status: 500 });
    }
}

async function createUser(req, res) {
    const { username, email, password } = req.body;
    try {
        const rootFolder = await Folder.create({ name: 'root' });
        const user = await User.create({ username, email, password, dashboard: rootFolder._id });
        await Folder.findByIdAndUpdate(rootFolder._id, {owner: user._id});
        res.redirect(`/users/${user._id}`);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).render('error', { message: 'Internal Server Error', status: 500 });
    }
}

function getCreateUserForm(req, res) {
    res.render('create-user');
}

async function getUserInfo(req, res) {
    const userId = req.params.id;
    try {
        const user = await User.findById(userId);
        if (!user) throw new Error('User not found');
        res.render('user-info', { user });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(404).render('error', { message: 'User not found', status: 404 });
    }
}

async function updateUser(req, res) {
    const userId = req.params.id;
    const { username, email, password } = req.body;
    try {
        await User.findByIdAndUpdate(userId, { username, email, password });
        res.redirect(`/users/${userId}`);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).render('error', { message: 'Internal Server Error', status: 500 });
    }
}

async function deleteUser(req, res) {
    const userId = req.params.id;
    try {
        await User.findByIdAndDelete(userId);
        res.redirect('/');
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).render('error', { message: 'Internal Server Error', status: 500 });
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
        res.status(404).render('error', { message: 'User not found', status: 404 });
    }
}

module.exports = {
    getAllUsers,
    createUser,
    getCreateUserForm,
    getUserInfo,
    updateUser,
    deleteUser,
    getEditUserForm
};
