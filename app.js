// dependencies
var config = require('./oauth.js');
var path = require('path');
var express = require('express');
var http = require('http');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

// main config
var flash = require('connect-flash');
var app = express();
app.set('port', process.env.PORT || 1337);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set('view options', { layout: false });
app.use(express.logger());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('keyboard cat'));
app.use(express.session(({ cookie: { maxAge: 60000 }})));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.configure('development', function () {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function () {
    app.use(express.errorHandler());
});

// passport config
var Account = require('./models/account');
passport.use(new LocalStrategy(Account.authenticate()));
//passport.serializeUser(Account.serializeUser());
//passport.deserializeUser(Account.deserializeUser());
//passport.serializeUser(function (user, done) {
//    done(null, user);
//});
//passport.deserializeUser(function (obj, done) {
//    done(null, obj);
//});

passport.use(new FacebookStrategy({
        clientID: config.facebook.clientID,
        clientSecret: config.facebook.clientSecret,
        callbackURL: config.facebook.callbackURL
    },
    function (accessToken, refreshToken, profile, done) {
        Account.findOne({ username: profile.emails }, function (err, user) {
            if (err) {
                console.log(err);
            }
            if (!err && user != null) {
                done(null, user);
            } else {
                var user = new Account({
                    username: profile.emails,
                    first_name: profile.name.givenName,
                    last_name: profile.name.familyName,
                    terms: false
                });
                user.save(function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("saving user ...");
                        done(null, user);
                    }
                });
            }

        });
    }
));

// serialize and deserialize
passport.serializeUser(function (user, done) {
    console.log('serializeUser: ' + user._id);
    done(null, user._id);
});
passport.deserializeUser(function (id, done) {
    Account.findById(id, function (err, user) {
        console.log(user);
        if (!err) done(null, user);
        else done(err, null)
    })
});


// mongoose
mongoose.connect('mongodb://localhost/passport_local_mongoose');

// routes
require('./routes')(app);

app.listen(app.get('port'), function () {
    console.log(("Express server listening on port " + app.get('port')))
});