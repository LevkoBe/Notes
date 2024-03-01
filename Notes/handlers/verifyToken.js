const jwt = require('jsonwebtoken');
const secretKey = 'very-secret-key';

const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).render('login', { error: 'Provide username and password, please' });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(403).render('login', { error: 'Provide username and password, please' });
        }
        req.userId = decoded;
        next();
    });
};

module.exports = verifyToken;