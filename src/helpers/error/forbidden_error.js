class ForbiddenError {
  constructor(param = 'forbidden') {
    this.message = param.message || param;
    this.data = param.data;
    this.code = param.code;
  }
}

module.exports = ForbiddenError;