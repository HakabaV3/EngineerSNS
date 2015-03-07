//@include api_core.js

API.User = {
    get: function(userName, callback) {
        return API.get('/user/' + userName, callback);
    },
    me: function(callback) {
        return API.get('/user/me', callback);
    },
    post: function(userName, password, callback) {
        return API.post('/user/' + userName, {
            'password': password
        }, callback);
    },
    patch: function(userName, params, callback) {
        return API.patch('/user/' + userName, params, callback);
    },
    patchIcon: function(userName, blob, callback) {
        return API.patchB('/user/' + userName + '/icon', blob, callback);
    },
    delete: function(userName, callback) {
        return API.delete('/user/' + userName, callback);
    }
};

API.Project = {
    get: function(userName, projectName, callback) {
        return API.get('/user/' + userName + '/project/' + projectName, callback);
    },
    getAll: function(userName, callback) {
        return API.get('/user/' + userName + '/project', callback);
    },
    post: function(userName, projectName, callback) {
        return API.post('/user/' + userName + '/project/' + projectName, callback);
    },
    patch: function(userName, projectName, callback) {
        return API.patch('/user/' + userName + '/project/' + projectName, callback);
    },
    delete: function(userName, projectName, callback) {
        return API.delete('/user/' + userName + '/project/' + projectName, callback);
    }
};
