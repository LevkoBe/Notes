const { Folder } = require('../models');

async function getUserDashboard(req, res) {
    try {
        const userId = req.params.id; // todo: add checking for user's identity
        const folderId = req.params.folderId;
        const folder = await Folder.findOne({ _id: folderId }).populate('subfolders notes');
        if (!folder) {
            return res.status(404).render('error', { message: 'Folder not found', status: 404 });
        }
        res.render('dashboard', { folders: folder.subfolders, notes: folder.notes, folder: folder, userId: userId });
    } catch (error) {
        console.error('Error fetching user dashboard:', error);
        res.status(500).render('error', { message: 'Internal Server Error', status: 500 });
    }
}

async function getGroupDashboard(req, res) {
    try {
        const groupId = req.params.id;
        const folderId = req.params.folderId;
        const folder = await Folder.findOne({ _id: folderId }).populate('subfolders notes');

        if (!folder) {
            return res.status(404).render('error', { message: 'Folder not found', status: 404 });
        }
        res.render('dashboard', { folders: folder.subfolders, notes: folder.notes, folder: folder, groupId: groupId });
    } catch (error) {
        console.error('Error fetching group dashboard:', error);
        res.status(500).render('error', { message: 'Internal Server Error', status: 500 });
    }
}

module.exports = {
    getUserDashboard,
    getGroupDashboard
};
