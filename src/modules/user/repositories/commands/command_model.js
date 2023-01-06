const Joi = require('joi');

const registerUserSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const updateUserSchema = Joi.object({
  id: Joi.number().required(),
  name: Joi.string().required(),
  email: Joi.string().email().required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const user = () => {
  return {
    name: '',
    email: '',
    password: '',
    is_active: 0, // false
    created_at: '',
    updated_at: ''
  };
};

module.exports = {
  user,
  registerUserSchema,
  updateUserSchema,
  loginSchema
};
