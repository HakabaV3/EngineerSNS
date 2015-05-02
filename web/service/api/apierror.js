/**
 *  namespace for definition of API Errors
 *  @namespace
 */
var APIError = {};

APIError.Code = {
    SUCCESS: 0,
    PERMISSION_DENIED: 1,
    PARSE_FAILED: 2,
    CONNECTION_FAILED: 3,
    USED_NAME: 4,
    INVALID_PARAMETER: 5,
    UNKNOWN: 999
};

extend(APIError, {
    SUCCESS: {
        code: APIError.Code.SUCCESS,
        msg: 'success'
    },
    PERMISSION_DENIED: {
        code: APIError.Code.PERMISSION_DENIED,
        msg: 'Permission denied.',
    },
    PARSE_FAILED: {
        code: APIError.Code.PARSE_FAILED,
        msg: 'Failed to parse response.',
    },
    CONNECTION_FAILED: {
        code: APIError.Code.CONNECTION_FAILED,
        msg: 'Failed to connect server.',
    },
    USED_NAME: {
        code: APIError.Code.USED_NAME,
        msg: 'This user name is already used.'
    },
    INVALID_PARAMETER: {
        code: APIError.Code.INVALID_PARAMETER,
        msg: 'Parameters are invalid.'
    },
    UNKNOWN: {
        code: APIError.Code.UNKNOWN,
        msg: 'Unknown error.'
    }
});

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

/**
 *  エラーを特定する。
 *  ものすごく地道な実装。
 *  サーバーは頼むからエラーをコードで返してくれ！
 */
APIError.detectError = function(err) {
    if (isObject(err)) {
        switch (err.code) {
            case APIError.Code.PERMISSION_DENIED:
                return APIError.PERMISSION_DENIED;
                break;

            case APIError.Code.PARSE_FAILED:
                return APIError.PARSE_FAILED;
                break;

            case APIError.Code.CONNECTION_FAILED:
                return APIError.CONNECTION_FAILED;
                break;

            default:
                return extend(APIError.UNKNOWN, {
                    original: err
                });
                break;
        }
    }

    if (err === 'ユーザー名は既に使用されています。') {
        return APIError.USED_NAME;
    }

    if (err === 'ユーザー名またはパスワードに誤りがあります。') {
        return APIError.INVALID_PARAMETER;
    }

    return extend(APIError.UNKNOWN, {
        original: err
    });
};

module.exports = APIError;
