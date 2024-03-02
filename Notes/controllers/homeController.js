const { Group, Note, User, Folder } = require('../models');

async function renderHomePage(req, res) {
    try {
        const userId = req.userId.userId;
        const groups = await Group.find();
        const notes = await Note.find({ owner: userId });
        const user = await User.findById(userId);
        const friends = await User.find({ _id: { $in: user.friends } });
        
        res.render('home', { groups, notes, user, friends });
    } catch (error) {
        console.error('Error fetching groups and users:', error);
        res.status(500).render('error', { message: 'Error fetching home components', status: 500 });
    }
}

function logoutController(req, res) {
    res.clearCookie('token');
    res.redirect('/login');
}

async function friendsPage(req, res) {
    try {
        const userId = req.userId.userId;
        const user = await User.findById(userId);
        const friends = await User.find({ _id: { $in: user.friends } });
        
        res.render('friends', { friends, user });
    } catch (error) {
        console.error('Error fetching groups and users:', error);
        res.status(500).render('error', { message: 'Some problems with your friends', status: 500 });
    }
}

async function renderDashboard(req, res) {
    try {
        const userId = req.userId.userId;
        const user = await User.findById(userId);
        const dashboard = await Folder.findById(user.dashboard);
        res.redirect(`users/${userId}/${dashboard._id}`);
    } catch (err) {
        console.error('Error rendering dashboard:', err);
        res.status(500).render('error', { message: 'Error fetching your dashboard', status: 500 });
    }
}

module.exports = {
    renderHomePage,
    logoutController,
    friendsPage,
    renderDashboard
};
