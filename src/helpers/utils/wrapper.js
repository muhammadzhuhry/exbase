const data = (data) => ({ error: null, data});

const error = (error) => ({ error, data: null });

const response = (res, type, result, message = '', responseCode = 200) => {
 let status, data, code;
 
 status = true;
 data = result.data;
 code = responseCode;

 if (type === 'fail') {
   status = false;
   data = result.error.data || '';
   message = result.error.message || message;
   code = result.error.code
   responseCode = 0;
 }

 let modelResponse = {
  success: status,
  data,
  message,
  code
 };

 res.responseCode(responseCode, modelResponse);
}

module.exports = {
  data,
  error
};