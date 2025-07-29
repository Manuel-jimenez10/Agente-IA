import Joi from 'joi'

export const getMenuByRole = Joi.object({
	body: Joi.object().length(0),
	query: Joi.object({
		rol: Joi.string().required(),
	}),
	headers: Joi.object().unknown(true),
	file: Joi.forbidden(),
})


export const assignModule = Joi.object({
	body: Joi.object({
		role: Joi.string().required(),
		module: Joi.string().required(),
	}).required(),
	query: Joi.object().length(0),
	headers: Joi.object().unknown(true),
	file: Joi.forbidden(),
})

export const deallocateModule = Joi.object({
	body: Joi.object({
		role: Joi.string().required(),
		module: Joi.string().required(),
	}).required(),
	query: Joi.object().length(0),
	headers: Joi.object().unknown(true),
	file: Joi.forbidden(),
})


export const createRole = Joi.object({
	body: Joi.object({
		name: Joi.string().min(3).max(30).required(),
		description: Joi.string().max(255).optional(),
	}).required(),
	query: Joi.object().length(0),
	headers: Joi.object().unknown(true),
	file: Joi.forbidden(),
})

export const createModule = Joi.object({
	body: Joi.object({
		name: Joi.string().required(),
		type: Joi.string()
			.valid('principal', 'configuraciones', 'herramientas')
			.required(),
	}).required(),
	query: Joi.object().length(0),
	headers: Joi.object().unknown(true),
	file: Joi.forbidden(),
})