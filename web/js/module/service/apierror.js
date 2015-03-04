/**
 *	namespace for definition of API Errors
 *	@namespace
 */
var APIError = {};

/**
 *	Error for failed to parse server response.
 *	@param {XMLHttpRequest} xhr failed xhr object.
 *	@return {Object} error object.
 */
APIError.parseFailed = function(xhr) {
    return {
        error: {
            name: 'PARSE_FAILED',
            msg: 'Failed to parse response.',
            xhr: xhr
        }
    };
};

/**
 *	Error for failed to connection.
 *	@param {XMLHttpRequest} xhr failed xhr object.
 *	@return {Object} error object.
 */
APIError.connectionFailed = function(xhr) {
    return {
        error: {
            name: 'CONNECTION_FAILED',
            msg: 'Failed to connect server.',
            xhr: xhr
        }
    };
};
