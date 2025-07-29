import Joi from 'joi'

export const getItemsByType = Joi.object({
	body: Joi.object().length(0),
	query: Joi.object({
		type: Joi.string().required(),
	}),
	headers: Joi.object().unknown(true),
	file: Joi.forbidden(),
})

export const getItem = Joi.object({
	body: Joi.object().length(0),
	query: Joi.object({
		id: Joi.string().required(),
	}),
	headers: Joi.object().unknown(true),
	file: Joi.forbidden(),
})

export const deleteItem = Joi.object({
	body: Joi.object().length(0),
	query: Joi.object({
		id: Joi.string().required(),
	}),
	headers: Joi.object().unknown(true),
	file: Joi.forbidden(),
})

export const registerMenuItem = Joi.object({
	query: Joi.object().length(0).required(),
	body: Joi.object({
		label: Joi.string().required(),
		route: Joi.string().required(),
		icon: Joi.string().optional(),
		module: Joi.string().required(),
		type: Joi.string()
			.valid('principal', 'configuraciones', 'herramientas')
			.required(),
		visible: Joi.boolean().optional(),
		order: Joi.number().optional(),
	})
		.min(1)
		.required(),
	params: Joi.object().length(0),
	headers: Joi.object().unknown(true),
})

export const updateItem = Joi.object({
	query: Joi.object({
		id: Joi.string().required(),
	}).required(),
	body: Joi.object({
		label: Joi.string().required(),
		route: Joi.string().required(),
		icon: Joi.string().optional(),
		module: Joi.string().required(),
		type: Joi.string()
			.valid('principal', 'configuraciones', 'herramientas')
			.required(),
		visible: Joi.boolean().optional(),
		order: Joi.number().optional(),
	})
		.min(1)
		.required(),
	params: Joi.object().length(0),
	headers: Joi.object().unknown(true),
})