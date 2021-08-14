class ConflictError {
  constructor(param = 'conflict') {
    this.message = param.message || param;
    this.data = param.data;
    this.code = param.code;
  }
}

module.exports = ConflictError;