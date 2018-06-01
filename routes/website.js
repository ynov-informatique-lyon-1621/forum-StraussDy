const router = require('express').Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
const saltRounds = 12;
const {Question, Comment, User} = require('../models');

function authNeeded(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

router.get('/', (req, res) => {
    if (req.user !== undefined && req.user !== null) {
        Question
            .sync()
            .then(() => {
                Question
                    .findAll({include: [User]})
                    .then((questions) => {
                        console.log(questions);
                        res.render('website/home', {questions, user: req.user, user: req.user.dataValues});
                    })
            })

    } else {
        res.redirect("/login");
    }
});

router.get('/login', (req, res) => {
    if (req.user) {
        return res.redirect('/');
    }
    res.render('website/login');
});

router.get('/profile', authNeeded, (req, res) => {
    res.render('website/profile', {
        user: req.user
    });
});

router.get('/addquestion', authNeeded, (req, res) => {
    res.render('website/addquestion', {
        user: req.user
    });
});

router.post('/addquestion', (req, res) => {
    const {title, content} = req.body;
    Question
        .sync()
        .then(() => Question.create({title, content, userId: req.user.id}))
        .then(() => res.redirect('/'));
});


router.post('/question/:questionId/resolu', (req, res) => {
    Question
        .sync()
        .then(() => Question.update({resolu: new Date()}, {where: {id: req.params.questionId}}))
        .then(() => res.redirect('/'));
});

router.get('/question/:questionId', (req, res) => {
    const {title, content} = req.body;
    Question
        .sync()
        .then(() => Question.findOne({
            where: {id: req.params.questionId},
            include: [{model: Comment, include: [User]}, User]
        }))
        .then((question) => res.render('website/question', {question, user: req.user}));
});


router.post('/comment/:questionId', (req, res) => {
    const {content} = req.body;
    Comment
        .sync()
        .then(() => Comment.create({content, questionId: req.params.questionId, userId: req.user.id}))
        .then(() => res.redirect('/question/' + req.params.questionId));
});


router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
}));

router.get('/register', (req, res) => {
    if (req.user) {
        return res.redirect('/');
    }
    res.render('website/register');
});

router.post('/register', (req, res) => {
    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
        User
            .sync()
            .then(() => {
                User.find({
                    where: {
                        mail: req.body.username,
                    }
                })
            })
            .then((user) => {
                console.error(user);
                if (user === null || user === undefined) {
                    User.count()
                        .then((count) => {
                            let role = "default";
                            if (count === 0) {
                                role = "admin";
                            }
                            return User.create({
                                mail: req.body.username,
                                fullname: req.body.fullname,
                                password: hash,
                                username: req.body.username,
                                role:role,
                                bio: req.body.bio
                            });
                        })
                        .then((user) => {
                            console.log(user);
                            user = user.dataValues;
                            console.error(user);
                            req.login(user, function (err) {
                                if (err) {
                                    console.error(err);
                                    res.redirect('/register');
                                } else {
                                    res.redirect('/');
                                }
                            });
                        })

                }
            })
            .catch((err) => {
                console.error(err);
                if (err) {
                    res.send(500);
                }
            });
    });
});

router.get('/disconnect', (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;
