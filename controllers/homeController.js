const { Group, Note, User } = require('../models');

function chatController(req, res){
    res.render('chat');
}

async function renderHomePage(req, res) {
    try {
        const userId = req.userId.userId;
        const groups = await Group.find();
        const notes = await Note.find({owner: userId});
        const user = await User.findById(userId);

        res.render('home', { groups, notes, user });
    } catch (error) {
        console.error('Error fetching groups and users:', error);
        res.status(500).render('error', { message: 'Internal Server Error', status: 500 });
    }
}

function logoutController(req, res) {
    res.clearCookie('token');
    res.redirect('/login');
}

module.exports = {
    renderHomePage,
    chatController,
    logoutController
};
