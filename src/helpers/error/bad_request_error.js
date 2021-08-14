class BadRequestError {
  constructor(param = 'bad request') {
    this.message = param.message || param;
    this.data = param.data;
    this.code = param.code;
  }
}

module.exports = BadRequestError;