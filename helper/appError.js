/* eslint-disable max-classes-per-file */
class InternalServerError extends Error {
  constructor(message) {
    super(message);
    this.name = 'Internal Server Error';
    this.statusCode = 500;
  }
}

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'Not Found'
    this.statusCode = 404;
  }
}

class BadInputError extends Error {
  constructor(message) {
    super(message);
    this.name = 'Bad Input';
    this.statusCode = 400;
    this.isOprational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

class AuthorizationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'Unauthorized';
    this.statusCode = 401
  }
}

module.exports = {
  InternalServerError,
  NotFoundError,
  BadInputError,
  AuthorizationError,

}
