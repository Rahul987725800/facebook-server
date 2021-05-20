import Joi from '@hapi/joi';
export const authSchema = ({
  email = true,
  password = true,
  username = true,
}) => {
  return Joi.object({
    email: email && Joi.string().email().lowercase().required(),
    password: password && Joi.string().min(3).required(),
    username: username && Joi.string().required(),
  });
};
