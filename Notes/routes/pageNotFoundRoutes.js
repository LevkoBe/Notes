const router = require('express').Router();

router.get('/', (req, res) => {
    res.status(404).render('error', {message: 'Page not found', status: 404});
});

module.exports = router;
