const { NotFoundError, InternalServerError, BadRequestError, ConflictError,
  ForbiddenError, UnauthorizedError } = require('../error');

const data = (data) => ({ error: null, data});

const error = (error) => ({ error, data: null });

const response = (res, type, result, message = '', responseCode = 200) => {
 let status, data, code;
 
 status = true;
 data = result.data;
 code = responseCode;

 if (type === 'fail') {
   const errCode = checkErrorCode(result.err);
   status = false;
   data = result.error.data || '';
   message = result.error.message || message;
   code = result.error.code
   responseCode = errCode;
 }

 let modelResponse = {
  success: status,
  data,
  message,
  code
 };

 res.responseCode(responseCode, modelResponse);
}

const checkErrorCode = (error) => {
  switch (error.constructor) {
  case BadRequestError:
    return httpError.BAD_REQUEST;
  case ConflictError:
    return httpError.CONFLICT;
  case ForbiddenError:
    return httpError.FORBIDDEN;
  case InternalServerError:
    return httpError.INTERNAL_ERROR;
  case NotFoundError:
    return httpError.NOT_FOUND;
  case UnauthorizedError:
    return httpError.UNAUTHORIZED;
  default:
    return httpError.CONFLICT;
  }
};

module.exports = {
  data,
  error,
  response
};