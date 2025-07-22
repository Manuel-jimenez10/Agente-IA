import Joi from 'joi'

export const registerCheckpoint = Joi.object({
	body: Joi.object({
		name: Joi.string().min(2).max(80).required(),
		location: Joi.string().min(2).max(100).required(),
		status: Joi.string().valid('active', 'inactive').required(),
		operators: Joi.array().items(Joi.string()).default([]),
		casesTotal: Joi.number().min(0).default(0),
		casesAttended: Joi.number().min(0).default(0),
	}).required(),
	query: Joi.object().length(0),
	params: Joi.object().length(0),
	headers: Joi.object().unknown(true),
})

export const getCheckpoint = Joi.object({
	query: Joi.object({
		id: Joi.string().required(),
	}).required(),
	body: Joi.object().length(0),
	params: Joi.object().length(0),
	headers: Joi.object().unknown(true),
})

export const updateCheckpoint = Joi.object({
	query: Joi.object({
		id: Joi.string().required(),
	}).required(),
	body: Joi.object({
		name: Joi.string().min(2).max(80).optional(),
		location: Joi.string().min(2).max(100).optional(),
		status: Joi.string().valid('active', 'inactive').optional(),
		operators: Joi.array().items(Joi.string()).optional(),
		casesTotal: Joi.number().min(0).optional(),
		casesAttended: Joi.number().min(0).optional(),
	})
		.min(1)
		.required(),
	params: Joi.object().length(0),
	headers: Joi.object().unknown(true),
})

export const deleteCheckpoint = Joi.object({
	query: Joi.object({
		id: Joi.string().required(),
	}).required(),
	body: Joi.object().length(0),
	params: Joi.object().length(0),
	headers: Joi.object().unknown(true),
})

export const getAllCheckpoints = Joi.object({
	query: Joi.object({
		fields: Joi.string().optional(),
	}),
	body: Joi.object().length(0),
	params: Joi.object().length(0),
	headers: Joi.object().unknown(true),
})