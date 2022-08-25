class ExpressError extends Error {
    constructor(message, statusCode) {
        super();
        console.log("error");
        this.message = message;
        this.statusCode = statusCode;
    }
}

module.exports = ExpressError;