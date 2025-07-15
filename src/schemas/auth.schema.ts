import Joi from 'joi';

export const register = Joi.object({
	body: Joi.object({
		email: Joi.string().email().required(),
		phone: Joi.string()
			.pattern(/^(\+\d{1,3})?\d{7,14}$/)
			.required(),
		name: Joi.string().min(2).max(50).required(),
		lastname: Joi.string().min(2).max(50).required(),
	}).required(),
	query: Joi.object().length(0),
	headers: Joi.object().unknown(true),
	file: Joi.forbidden(),
})


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