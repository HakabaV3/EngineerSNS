var API = require('../service/api/api.js'),
    User = require('./user.js');

/**
 *  Authentication methods.
 *
 *  This API category DOES NOT have any model (as 'Auth'), methods only.
 *
 *  @namespace
 */
Auth = {};

/**
 *  Sign in.
 *  @param {string} userName userName.
 *  @param {string} password password.
 *  @param {Function} callback callback.
 */
Auth.signIn = function(userName, password, callback) {
    API.post('/auth', null, {
        'userName': userName,
        'password': password
    }, function(err, res) {
        if (err) {
            API.updateToken(null);
            return callback(err, null);
        }

        return callback(null, new User(res));
    });
};

/**
 *  Sign out.
 *  @param {Function} callback callback.
 */
Auth.signOut = function(callback) {
    API.delete('/auth', null, function(err, res) {
        API.updateToken(null);
        return callback(null, null);
    });
};

/**
 *  Sign up.
 *  @param {string} userName userName.
 *  @param {string} password password.
 *  @param {Function} callback callback.
 */
Auth.signUp = function(userName, password, callback) {
    API.post('/user/' + userName, null, {
        'password': password
    }, function(err, res) {
        if (err) {
            API.updateToken(null);
            return callback(err, null);
        }

        return callback(null, new User(res));
    });
};

module.exports = Auth;
