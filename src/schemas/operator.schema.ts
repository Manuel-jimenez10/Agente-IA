import Joi from 'joi'

export const registerOperator = Joi.object({
	body: Joi.object({
		name: Joi.string().min(2).max(80).required(),
		lastname: Joi.string().min(2).max(80).required(),
		document: Joi.string().min(5).max(20).required(),
		phone: Joi.string()
			.pattern(/^(\+\d{1,3})?\d{7,14}$/)
			.required(),
		status: Joi.string().valid('active', 'inactive').required(),
		role: Joi.string().min(2).max(50).required(),
		assignedCheckpointId: Joi.string().optional(),
	}).required(),
	query: Joi.object().length(0),
	params: Joi.object().length(0),
	headers: Joi.object().unknown(true),
})

export const getOperator = Joi.object({
	query: Joi.object({
		id: Joi.string().required(),
	}).required(),
	body: Joi.object().length(0),
	params: Joi.object().length(0),
	headers: Joi.object().unknown(true),
})

export const updateOperator = Joi.object({
	query: Joi.object({
		id: Joi.string().required(),
	}).required(),
	body: Joi.object({
		name: Joi.string().min(2).max(80).optional(),
		lastname: Joi.string().min(2).max(80).optional(),
		document: Joi.string().min(5).max(20).optional(),
		phone: Joi.string()
			.pattern(/^(\+\d{1,3})?\d{7,14}$/)
			.optional(),
		status: Joi.string().valid('active', 'inactive').optional(),
		role: Joi.string().min(2).max(50).optional(),
		assignedCheckpointId: Joi.string().optional(),
	})
		.min(1)
		.required(),
	params: Joi.object().length(0),
	headers: Joi.object().unknown(true),
})

export const deleteOperator = Joi.object({
	query: Joi.object({
		id: Joi.string().required(),
	}).required(),
	body: Joi.object().length(0),
	params: Joi.object().length(0),
	headers: Joi.object().unknown(true),
})

export const getAllOperators = Joi.object({
	query: Joi.object({
		fields: Joi.string().optional(),
	}),
	body: Joi.object().length(0),
	params: Joi.object().length(0),
	headers: Joi.object().unknown(true),
})
