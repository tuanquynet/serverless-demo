function create({ errorCode, message }) {
  const error = new Error(message);
  error.code = errorCode || 500;
  return error;
}

function throwException({ message, errorCode }) {
  const error = new Error(message);
  error.code = errorCode || 500;
  throw error;
}

function apiGateWayException(statusCode = 500, message = '', trace = '') {
  return {
    statusCode,
    message,
    trace,
  };
}

const exception = {
  create,
  throw: throwException,

  badRequestError: message => create({ errorCode: 400, message: message || 'Bad request' }),
  unauthenticatedError: message => create({ errorCode: 401, message: message || 'Not logged in' }),
  unauthorizedError: message => create({ errorCode: 403, message: message || 'Not allowed' }),
  invalidRouteError: message => create({ errorCode: 404, message: message || 'The URL is not a valid route, or the item resource does not exist' }),
  methodNotAllowedError: message => create({ errorCode: 405, message: message || 'Method Not Allowed' }),
  genericServerError: message => create({ errorCode: 500, message: message || 'Something unexpected happened' }),

  apiGateWayException,
};

export default exception;
