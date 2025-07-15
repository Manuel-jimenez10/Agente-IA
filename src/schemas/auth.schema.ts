import Joi from 'joi';

export const register = Joi.object({
  body: Joi.object({
    email: Joi.string().required(),
    phone: Joi.string().required()    
  }).required(),
  query: Joi.object().length(0),
  headers: Joi.object().unknown(true),
  file: Joi.forbidden()  
});

export const activateAccount = Joi.object({
  body: Joi.object({
    token: Joi.string().required()  
  }).required(),
  query: Joi.object().length(0),
  headers: Joi.object().unknown(true),
  file: Joi.forbidden()  
});

export const login = Joi.object({
  body: Joi.object({
    id: Joi.string().required(),
    clientId: Joi.string().required()
  }).required(),
  query: Joi.object().length(0),
  headers: Joi.object().unknown(true),
  file: Joi.forbidden()  
});

export const logout = Joi.object({
  body: Joi.object().length(0),
  query: Joi.object().length(0),
  headers: Joi.object({
    authorization: Joi.string().min(5).required()
  }).unknown(true),
  file: Joi.forbidden()  
});

export const refreshToken = Joi.object({
  body: Joi.object({
    sub: Joi.string().min(5).required(),
    clientId: Joi.string().required()
  }).required(),
  query: Joi.object().length(0),
  headers: Joi.object().unknown(true),
  file: Joi.forbidden() 
});

export const verifyLogin = Joi.object({
  body: Joi.object({     
    sessionId: Joi.string().required(),
    clientId: Joi.string().required()
  }).required(),
  query: Joi.object().length(0),
  headers: Joi.object().unknown(true),
  file: Joi.forbidden()  
});

export const createNewToken = Joi.object({
  body: Joi.object({
    email: Joi.string().required(),
    clientId: Joi.string().required(),
    sessionId: Joi.string().required()
  }).required(),
  query: Joi.object().length(0),
  headers: Joi.object().unknown(true),
  file: Joi.forbidden()  
});