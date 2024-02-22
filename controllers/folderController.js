const { Folder } = require('../models');

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

        // res.status(201).json(savedFolder);
        res.status(201).redirect(`/users/${userId}/${savedFolder.id}`);
    } catch (error) {
        console.error('Error creating Folder:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = {
    createFolderController
};
