const {Group, Folder, User} = require('../models');

async function getAllGroups(req, res) {
    try {
        const groups = await Group.find();
        res.render('groups-list', { groups });
    } catch (error) {
        console.error('Error fetching groups:', error);
        res.status(500).render('error', { message: 'An error occured trying to fetch your groups', status: 500 });
    }
}

async function createGroup(req, res) {
    const { name, members } = req.body;
    try {
        const rootFolder = await Folder.create({ name: 'root', parentId: null });
        const group = await Group.create({ 
            name, 
            creator: req.userId.userId,
            members, 
            dashboard: rootFolder._id 
        });
        res.redirect(`/groups/${group.id}`);
    } catch (error) {
        console.error('Error creating group:', error);
        res.status(500).render('error', { message: 'An error occured trying to create the group ', status: 500 });
    }
}

async function getCreateGroupForm(req, res) {
    try {
        const userId = req.userId.userId;
        const user = await User.findById(userId);
        const friends = await User.find({ _id: { $in: user.friends } });
        res.render('create-group', {friends: friends});
    } catch (error) {
        console.error('Error rendering create-group form:', error);
        res.status(500).render('error', { message: "Group form could not be displayed.", status: 500 });
    }
}

async function getGroupInfo(req, res) {
    const groupId = req.params.id;
    try {
        const group = await Group.findById(groupId);
        if (!group) throw new Error('Group not found');

        const creator = await User.findById(group.creator);
        const members = await User.find({ _id: { $in: group.members } });

        res.render('group-info', { group, members, creator });
    } catch (error) {
        console.error('Error fetching group:', error);
        res.status(404).render('error', { message: 'Group not found', status: 404 });
    }
}

async function updateGroup(req, res) {
    const groupId = req.params.id;
    const { name, members } = req.body;
    try {
        await Group.findByIdAndUpdate(groupId, { name, members });
        res.redirect(`/groups/${groupId}`);
    } catch (error) {
        console.error('Error updating group:', error);
        res.status(500).render('error', { message: 'Group might not be updated', status: 500 });
    }
}

async function partialUpdateGroup(req, res) {
    const groupId = req.params.id;
    const updatedFields = req.body;
    try {
        await Group.findByIdAndUpdate(groupId, updatedFields);
        res.redirect(`/groups/${groupId}`);
    } catch (error) {
        console.error('Error updating group:', error);
        res.status(500).render('error', { message: 'Group might not be updated', status: 500 });
    }
}

async function deleteGroup(req, res) {
    const groupId = req.params.id;
    try {
        await Group.findByIdAndDelete(groupId);
        res.redirect('/');
    } catch (error) {
        console.error('Error deleting group:', error);
        res.status(500).render('error', { message: 'Group might not be deleted', status: 500 });
    }
}

async function getEditGroupForm(req, res) {
    const groupId = req.params.id;
    const userId = req.userId.userId;
    try {
        const group = await Group.findById(groupId);
        if (!group) throw new Error('Group not found');

        const currentUser = await User.findById(userId);
        const friends = await User.find({ _id: { $in: currentUser.friends } });

        res.render('edit-group', { group, friends });
    } catch (error) {
        console.error('Error fetching group for edit:', error);
        res.status(404).render('error', { message: 'Group not found', status: 404 });
    }
}

async function getChat(req, res) {
    const groupId = req.params.id;
    const group = await Group.findById(groupId);
    res.render('chat', { group: group });
}


module.exports = {
    getAllGroups,
    createGroup,
    getCreateGroupForm,
    getGroupInfo,
    updateGroup,
    partialUpdateGroup,
    deleteGroup,
    getEditGroupForm,
    getChat
};
