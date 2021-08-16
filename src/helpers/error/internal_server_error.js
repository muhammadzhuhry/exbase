class InternalServerError {
  constructor(param = 'internal server error') {
    this.message = param.message || param;
    this.data = param.data;
    this.code = param.code;
  }
}

module.exports = InternalServerError;