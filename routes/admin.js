const router = require('express').Router();
const {Question, Comment, User} = require('../models');

router.get('/', (req, res) => {
    User.sync()
        .then(() => {
            return User.findAll()
        })
        .then((users) => {
            res.render('admin/admin', {
                user: req.user, users
            });
        })
});

module.exports = router;
