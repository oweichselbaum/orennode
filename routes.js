var passport = require('passport');
var Account = require('./models/account');

module.exports = function (app) {

    app.get('/', function (req, res) {
        res.render('index', { user: req.user, message: req.flash('info') });
    });

    app.get('/account', ensureAuthenticated, function (req, res) {
        Account.findById(req.session.passport.user, function (err, user) {
            if (err) {
                return res.render("account", {info: "Sorry. Terms must be agreed to"});
            }

            if (user.terms == false) {
                res.render('account', { user: user});
            } else {
                req.flash('info', 'Thank you for using social sign in!');
                res.redirect("/");
            }

        });
    });

    app.post('/account', function (req, res) {
        Account.findById(req.session.passport.user, function (err, user) {
            user.update({"terms": req.body.terms}, function (err, account) {
                if (err) {
                    return res.render("account", {info: "Sorry. Terms must be agreed to"});
                }
                passport.authenticate('facebook')(req, res, function () {
                    req.flash('info', 'Thank you for doing Social registration!');
                    res.render("/");
                });
            });
        });
    });

    app.get('/auth/facebook',
        passport.authenticate('facebook', {scope: ['email']}),
        function (req, res) {
        });
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', { failureRedirect: '/' }),

        function (req, res) {
            res.redirect('/account');
        });

    app.get('/register', function (req, res) {
        res.render('register', { });
    });

    app.post('/register', function (req, res) {
        Account.register(new Account({ username: req.body.username, first_name: req.body.first_name, last_name: req.body.last_name, terms: req.body.terms }), req.body.password, function (err, account) {
            if (err) {
                return res.render("register", {info: "Sorry. That username already exists. Try again."});
            }
            passport.authenticate('local')(req, res, function () {
                req.flash('info', 'Thank you for doing normal registration!');
                res.redirect("/");
            });
        });
    });

    app.get('/login', function (req, res) {
        res.render('login', { user: req.user });
    });

    app.post('/login', passport.authenticate('local'), function (req, res) {
        res.redirect('/');
    });

    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

    app.get('/ping', function (req, res) {
        res.send("pong!", 200);
    });

    function ensureAuthenticated(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect('/')
    }

};