import * as Joi from 'joi';

export const validationSchema = Joi.object({
  // JWT secrets
  JWT_ACCESS_SECRET: Joi.string().required(),
  JWT_REFRESH_SECRET: Joi.string().required(),
  JWT_ACCESS_EXPIRES_IN: Joi.number().required(),
  JWT_REFRESH_EXPIRES_IN: Joi.number().required(),
  // Uploads
  UPLOADS_ESTABLISHMENTS_PATH: Joi.string().required(),
  UPLOADS_PATH: Joi.string().default('uploads'),
  // Establishments
  MINIMUM_COMMENTS: Joi.number().required(),
  GLOBAL_AVERAGE_RATING: Joi.number().required(),
});
