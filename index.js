const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const passport = require('passport');

const app = express();

const COOKIE_SECRET = 'cookie_délicieux';

app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static('public'));

app.use(cookieParser(COOKIE_SECRET));
// Keep track of user sessions
app.use(session({
    secret: COOKIE_SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
    if (req.user !== undefined && req.user !== null) {
    console.log(req.user);
    res.render('index', {user: req.user.dataValues});
} else {
    res.redirect("/login");
}
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.listen(3000);