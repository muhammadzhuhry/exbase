class Unauthorized {
  constructor(param = 'unauthorized') {
    this.message = param.message || param;
    this.data = param.data;
    this.code = param.code;
  }
}

module.exports = Unauthorized;