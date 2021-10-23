class AppError extends Error {
    constructor(message, statusCode){
        // eslint-disable-next-line node/no-unsupported-features/es-syntax
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith(4) ? 'fail' : 'error';
        this.isOperational = true;
        this.errorName = message.name;
        this.path = message.path;
        this.value = message.value;
        Error.captureStackTrace(this, this.constructor);
        this.code = message.code;
        this.errmsg = message.errmsg;
        this.errors = message.errors;
    }
}

module.exports = AppError;