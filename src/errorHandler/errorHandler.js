class ErrorHandler extends Error {
  constructor(errorCode, message, statusCode) {
    super(message);
    this.errorCode = errorCode;
    this.statusCode = statusCode;
  }
}
module.exports = ErrorHandler;
