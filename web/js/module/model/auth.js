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
        var token;

        if (err) {
            return callback(err, null);
        }

        return callback(null, new User(res));
    });
};
