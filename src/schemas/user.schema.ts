import Joi from 'joi'

export const getUserSchema = Joi.object({
	params: Joi.object({
		id: Joi.string().length(24).required(),
	}),
	query: Joi.object().length(0),
	body: Joi.object().length(0),
	headers: Joi.object().unknown(true),
})

export const getUsersSchema = Joi.object({
	params: Joi.object().length(0),
	query: Joi.object().length(0),
	body: Joi.object().length(0),
	headers: Joi.object().unknown(true),
})  

export const updateUserSchema = Joi.object({
	body: Joi.object({
		name: Joi.string().min(2).max(50).optional(),
		lastname: Joi.string().min(2).max(50).optional(),
		phone: Joi.string()
			.pattern(/^(\+\d{1,3})?\d{7,14}$/)
			.optional(),
	})
		.min(1)
		.required(),
	params: Joi.object({
		id: Joi.string().length(24).required(),
	}),
	query: Joi.object().length(0),
	headers: Joi.object().unknown(true),
})

export const deleteUserSchema = Joi.object({
	params: Joi.object({
		id: Joi.string().length(24).required(),
	}),
	query: Joi.object().length(0),
	body: Joi.object().length(0),
	headers: Joi.object().unknown(true),
})
  
