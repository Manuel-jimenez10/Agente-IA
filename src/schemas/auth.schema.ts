import Joi from 'joi';

export const register = Joi.object({
	body: Joi.object({
		email: Joi.string().required(),
		phone: Joi.string().required(),
		name: Joi.string().required(),
		lastname: Joi.string().required(),
		password: Joi.string().required(),
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
    email: Joi.string().required(),
    password: Joi.string().required()
  }).required(),
  query: Joi.object().length(0),
  headers: Joi.object().unknown(true),
  file: Joi.forbidden()  
});

export const logoutSchema = Joi.object({
	body: Joi.object().length(0),
	query: Joi.object().length(0),
	headers: Joi.object().unknown(true),
	file: Joi.forbidden(),
})

export const refreshToken = Joi.object({
  body: Joi.object({
    sub: Joi.string().min(5).required()
  }).required(),
  query: Joi.object().length(0),
  headers: Joi.object().unknown(true),
  file: Joi.forbidden() 
});

export const getMe = Joi.object({
	body: Joi.object().length(0),
	query: Joi.object({
		userId: Joi.string().required()
	}),
	headers: Joi.object().unknown(true),
	file: Joi.forbidden(),
})
