const setTokenCookie = (res, userId) => {
    res.cookie('token', userId, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
    });
};

module.exports = setTokenCookie;
