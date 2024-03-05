const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Folder, User } = require('../models');
const setTokenCookie = require('../handlers/userCookie');
const secretKey = 'very-secret-key';
const saltRounds = 10;

async function createUser(req, res) {
    const { username, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.render('create-user', { message: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        const rootFolder = await Folder.create({ name: 'root' });
        const user = await User.create({ username, email, password: hashedPassword, dashboard: rootFolder._id });
        await Folder.findByIdAndUpdate(rootFolder._id, { owner: user._id });

        const userId = user._id;
        const token = jwt.sign({ userId }, secretKey, { expiresIn: '1h' });
        res.cookie('token', token);
        
        res.redirect(`/users/${userId}`);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).render('error', { message: 'Error creating user', status: 500 });
    }
}

function getCreateUserForm(req, res) {
    res.render('create-user');
}


async function loginController(req, res) {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.render('login', { error: 'Provide username and password, please' });
        }
        const user = await User.findOne({ username });

        if (!user) {
            return res.render('login', { error: 'Invalid username or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.render('login', { error: 'Invalid username or password' });
        }

        const userId = user._id;
        const token = jwt.sign({ userId }, secretKey, { expiresIn: '1h' });
        setTokenCookie(res, token);
        
        res.redirect('/');
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).render('error', { message: 'Error during login', status: 500 });
    }
}

module.exports = {
    createUser,
    getCreateUserForm,
    loginController
}
