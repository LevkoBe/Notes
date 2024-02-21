const { Folder } = require('../models');
const { User } = require('../models');
const { Group } = require('../models');

async function getUserDashboard(req, res) {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId).populate({
            path: 'dashboard',
            populate: {
                path: 'subfolders notes'
            }
        });
        if (!user) {
            return res.status(404).render('error', { message: 'User not found', status: 404 });
        }
        res.render('dashboard', { folders: user.dashboard.subfolders, notes: user.dashboard.notes });
    } catch (error) {
        console.error('Error fetching user dashboard:', error);
        res.status(500).render('error', { message: 'Internal Server Error', status: 500 });
    }
}

async function getGroupDashboard(req, res) {
    try {
        const groupId = req.params.id;
        const group = await Group.findById(groupId).populate({
            path: 'dashboard',
            populate: {
                path: 'subfolders notes'
            }
        });
        if (!group) {
            return res.status(404).render('error', { message: 'Group not found', status: 404 });
        }
        res.render('dashboard', { folders: group.dashboard.subfolders, notes: group.dashboard.notes });
    } catch (error) {
        console.error('Error fetching group dashboard:', error);
        res.status(500).render('error', { message: 'Internal Server Error', status: 500 });
    }
}

module.exports = {
    getUserDashboard,
    getGroupDashboard
};
