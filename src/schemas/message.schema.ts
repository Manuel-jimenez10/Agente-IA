import Joi from 'joi';

export const getMessages = Joi.object({
  body: Joi.object().length(0),
  query: Joi.object().length(0),  
  headers: Joi.object().unknown(true),
  file: Joi.forbidden()  
});

export const chatMessageDispatcher = Joi.object({
  body: Joi.object().length(0),
  query: Joi.object().length(0),  
  headers: Joi.object().unknown(true),
  file: Joi.forbidden()  
});