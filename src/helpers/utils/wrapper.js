const data = (data) => ({ error: null, data});

const error = (error) => ({ error, data: null });

module.exports = {
  data,
  error
};