const { Folder, User } = require('../models');

async function getAllFolders(req, res) {
    try {
        const userId = req.userId.userId;
        const user = await User.findById(userId);
        const folders = await Folder.find({owner: userId});
        res.render('folders-list', { folders, user });
    } catch (error) {
        console.error('Error fetching folders:', error);
        res.status(500).render('error', { message: 'An error occured fetching your folders', status: 500 });
    }
}

async function createFolderController(req, res) {
    try {
        const { name, notes, subfolders } = req.body;
        const folderId = req.params.folderId;
        const userId = req.params.userId;
        
        const parentFolder = await Folder.findById(folderId);
        const owner = parentFolder.owner;

        const newFolder = new Folder({ name, parentId: folderId, notes, subfolders, owner });
        const savedFolder = await newFolder.save();
        
        await Folder.findByIdAndUpdate(folderId, { $push: { subfolders: savedFolder._id } });

        res.status(201).redirect(`/users/${userId}/${savedFolder.id}`);
    } catch (error) {
        console.error('Error creating Folder:', error);
        res.status(500).json({ error: 'IDs of the folder and the user are not recognized by the server' });
    }
}

module.exports = {
    createFolderController,
    getAllFolders
};
