const Joi = require('@hapi/joi');
const wrapper = require('../../../helpers/utils/wrapper');
const { BadRequestError } = require('../../../helpers/error');

const validateInsertUser = async (payload) => {
  const validSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required()
  });

  const result = validSchema.validate(payload);

  if (result.error) {
    const message = result.error.details[0].message;
    return wrapper.error(new BadRequestError(message));
  }

  return wrapper.data(true);
};

const validateUpdateUser = async (payload) => {
  const validSchema = Joi.object({
    id: Joi.number().required(),
    name: Joi.string().optional(),
    gender: Joi.string().valid('Male', 'Female').optional()
  });

  const result = validSchema.validate(payload);

  if (result.error) {
    const message = result.error.details[0].message;
    return wrapper.error(new BadRequestError(message));
  }

  return wrapper.data(true);
};

module.exports = {
  validateInsertUser,
  validateUpdateUser
};
