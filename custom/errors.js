const errors = [
    {
        code: 400,
        key: 'BAD_REQUEST',
        message: 'The request was invalid or cannot be served'
    },
    {
        code: 401,
        key: 'INVALID_CREDENTIALS',
        message: 'Unauthorized: incorrect username or password'
    },
    {
        code: 402,
        key: 'PAYMENT_REQUIRED',
        message: 'Payment required to access this feature'
    },
    {
        code: 403,
        key: 'ACCESS_DENIED',
        message: 'Forbidden: you don’t have permission to access this resource'
    },
    {
        code: 404,
        key: 'NOT_FOUND',
        message: 'The requested resource was not found'
    },
    {
        code: 405,
        key: 'METHOD_NOT_ALLOWED',
        message: 'HTTP method not allowed for this endpoint'
    },
    {
        code: 408,
        key: 'REQUEST_TIMEOUT',
        message: 'The request timed out'
    },
    {
        code: 409,
        key: 'CONFLICT',
        message: 'Conflict: resource already exists or version mismatch'
    },
    {
        code: 410,
        key: 'GONE',
        message: 'The resource is no longer available'
    },
    {
        code: 415,
        key: 'UNSUPPORTED_MEDIA_TYPE',
        message: 'Unsupported media type in request'
    },
    {
        code: 429,
        key: 'TOO_MANY_REQUESTS',
        message: 'Rate limit exceeded: please slow down'
    },
    {
        code: 500,
        key: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong on the server'
    },
    {
        code: 501,
        key: 'NOT_IMPLEMENTED',
        message: 'This feature is not implemented yet'
    },
    {
        code: 502,
        key: 'BAD_GATEWAY',
        message: 'Invalid response from upstream server'
    },
    {
        code: 503,
        key: 'SERVICE_UNAVAILABLE',
        message: 'Service temporarily unavailable, please try again later'
    },
    {
        code: 504,
        key: 'GATEWAY_TIMEOUT',
        message: 'Gateway timed out waiting for response'
    }
];

module.exports = errors;