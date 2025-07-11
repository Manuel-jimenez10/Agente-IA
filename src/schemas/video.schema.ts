import Joi from 'joi';

export const report = Joi.object({
  body: Joi.object().length(0),
  query: Joi.object().length(0),  
  headers: Joi.object().unknown(true),
  file: Joi.forbidden()  
});
