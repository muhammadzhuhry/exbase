const Joi = require('joi');
const wrapper = require('../../../helpers/utils/wrapper');
const { BadRequestError } = require('../../../helpers/error');

const validateInsertBook = async (payload) => {
  const validSchema = Joi.object({
    title: Joi.string().required(),
    author: Joi.string().required(),
    description: Joi.string().required()
  });

  const result = validSchema.validate(payload);

  if (result.error) {
    const message = result.error.details[0].message;
    return wrapper.error(new BadRequestError(message));
  }

  return wrapper.data(true);
};

const validateUpdateBook = async (payload) => {
  const validSchema = Joi.object({
    id: Joi.string().required(),
    title: Joi.string().optional(),
    author: Joi.string().optional(),
    description: Joi.string().optional()
  });

  const result = validSchema.validate(payload);

  if (result.error) {
    const message = result.error.details[0].message;
    return wrapper.error(new BadRequestError(message));
  }

  return wrapper.data(true);
};


module.exports = {
  validateInsertBook,
  validateUpdateBook
};
