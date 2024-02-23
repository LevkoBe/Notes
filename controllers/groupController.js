const {Group, Folder} = require('../models');

async function getAllGroups(req, res) {
    try {
        const groups = await Group.find();
        res.render('groups-list', { groups });
    } catch (error) {
        console.error('Error fetching groups:', error);
        res.status(500).render('error', { message: 'Internal Server Error', status: 500 });
    }
}

async function createGroup(req, res) {
    const { name, members } = req.body;
    try {
        const rootFolder = await Folder.create({ name: 'root', parentId: null });
        const group = await Group.create({ name, members, dashboard: rootFolder._id });
        res.redirect(`/groups/${group.id}`);
    } catch (error) {
        console.error('Error creating group:', error);
        res.status(500).render('error', { message: 'Internal Server Error', status: 500 });
    }
}

function getCreateGroupForm(req, res) {
    res.render('create-group');
}

async function getGroupInfo(req, res) {
    const groupId = req.params.id;
    try {
        const group = await Group.findById(groupId);
        if (!group) throw new Error('Group not found');
        res.render('group-info', { group });
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
        res.status(500).render('error', { message: 'Internal Server Error', status: 500 });
    }
}

// todo: check if group is updated partially
async function partialUpdateGroup(req, res) {
    const groupId = req.params.id;
    const updatedFields = req.body;
    try {
        await Group.findByIdAndUpdate(groupId, updatedFields);
        res.redirect(`/groups/${groupId}`);
    } catch (error) {
        console.error('Error updating group:', error);
        res.status(500).render('error', { message: 'Internal Server Error', status: 500 });
    }
}

async function deleteGroup(req, res) {
    const groupId = req.params.id;
    try {
        await Group.findByIdAndDelete(groupId);
        res.redirect('/');
    } catch (error) {
        console.error('Error deleting group:', error);
        res.status(500).render('error', { message: 'Internal Server Error', status: 500 });
    }
}

async function getEditGroupForm(req, res) {
    const groupId = req.params.id;
    try {
        const group = await Group.findById(groupId);
        if (!group) throw new Error('Group not found');
        res.render('edit-group', { group });
    } catch (error) {
        console.error('Error fetching group for edit:', error);
        res.status(404).render('error', { message: 'Group not found', status: 404 });
    }
}

module.exports = {
    getAllGroups,
    createGroup,
    getCreateGroupForm,
    getGroupInfo,
    updateGroup,
    partialUpdateGroup,
    deleteGroup,
    getEditGroupForm
};
