/**
 *  namespace for definition of API Errors
 *  @namespace
 */
var APIError = {
    PERMISSION_DENIED: {
        code: 0,
        msg: 'Permission denied.',
    },
    PARSE_FAILED: {
        code: 1,
        msg: 'Failed to parse response.',
    },
    CONNECTION_FAILED: {
        code: 2,
        msg: 'Failed to connect server.',
    }
};


/**
 *  Error for failed to parse server response.
 *  @param {XMLHttpRequest} xhr failed xhr object.
 *  @return {Object} error object.
 */
APIError.parseFailed = function(xhr) {
    return extend(APIError.PARSE_FAILED, {
        xhr: xhr
    });
};

/**
 *  Error for failed to connection.
 *  @param {XMLHttpRequest} xhr failed xhr object.
 *  @return {Object} error object.
 */
APIError.connectionFailed = function(xhr) {
    return extend(APIError.CONNECTION_FAILED, {
        xhr: xhr
    });
};
