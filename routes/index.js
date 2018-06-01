const router = require('express').Router();
const website = require('./website');
const admin = require('./admin');

function isAuthenticated(req, res, next) {
    if (req.user && req.user.role === 'admin') {
        return next();
    }

    return res.redirect('/');
}

router.use('/', website);
router.use('/admin', isAuthenticated, admin);

module.exports = router;
