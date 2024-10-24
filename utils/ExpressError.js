class ExpressError extends Error {
    constructor(statusCode, message) {
        super(message); // Pass the message to the parent constructor
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor); // Capture stack trace
    }
}

module.exports = ExpressError;
