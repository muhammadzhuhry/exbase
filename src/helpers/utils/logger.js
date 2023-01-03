const moment = require('moment');
const morgan  = require('morgan');
const winston = require('winston');
const logform = require('logform');
const { combine, timestamp, label, printf, colorize } = logform.format;
const config = require('../../config');

const service = config.get('/name') + '-service';

const logger = winston.createLogger({
  format: combine(
    label({ label: 'content' }),
    timestamp({
      format: () => {
        return moment().format('YYYY-MM-DD HH:mm:ss');
      }
    }),
    colorize({ colors: { info: 'blue', error: 'red' }}),
    printf(data => {
      return data.meta ? `${data.timestamp} [${data.level}]: serviceApi=${data.serviceApi} method=${data.meta.method} url=${data.meta.url} code=${
        data.meta.code} contentLength=${data.meta.contentLength} responseTime=${data.meta.responseTime} ip=${data.meta.ip}` :
        `${data.timestamp} [${data.level}]: serviceApi=${data.serviceApi} context=${data.context} scope=${data.scope} message=${data.message}`;
    })
  ),
  transports: [new winston.transports.Console()],
  exitOnError: false
});

const error = (context, message, scope, meta) => {
  const obj = {
    context,
    scope,
    serviceApi : service,
    message: message,
    meta
  };
  logger.error(obj);
};

const info = (context, message, scope) => {
  const obj = {
    context,
    scope,
    serviceApi : service,
    message: message.toString()
  };
  logger.info(obj);
};


const init = () => {
  return morgan((tokens, req, res) => {
    const logData = {
      method: tokens.method(req, res),
      url: tokens.url(req, res),
      code: tokens.status(req, res),
      contentLength: tokens.res(req, res, 'content-length'),
      responseTime: `${tokens['response-time'](req, res, '0')}`, // in milisecond (ms)
      date: tokens.date(req, res, 'iso'),
      ip: tokens['remote-addr'](req,res)
    };
    const obj = {
      context: 'service-info',
      scope: 'audit-log',
      message: 'logging service...',
      serviceApi : service,
      meta: logData
    };
    logger.info(obj);
    return;
  });
};

module.exports = {
  info,
  error,
  init
};
