var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose');

var Account = new Schema({
    username: String,
    password: String,
    first_name: String,
    last_name: String,
    terms: Boolean
});

Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', Account);