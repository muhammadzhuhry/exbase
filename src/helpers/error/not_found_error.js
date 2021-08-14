class NotFoundError {
  constructor(param = 'not found') {
    this.message = param.message || param;
    this.data = param.data;
    this.code = param.code;
  }
}

module.exports = NotFoundError;