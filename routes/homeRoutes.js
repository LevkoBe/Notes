const router = require('express').Router();
const { Group, User } = require('../models');


router.get('/chat', (req, res) => {
    res.render('chat');
});
router.get('/', async (req, res) => {
    try {
        const groups = await Group.find();
        const users = await User.find();

        res.render('home', { groups, users });
    } catch (error) {
        console.error('Error fetching groups and users:', error);
        res.status(500).render('error', { message: 'Internal Server Error', status: 500 });
    }
});

module.exports = router;
