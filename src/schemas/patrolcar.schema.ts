import Joi from 'joi'

export const registerPatrolcar = Joi.object({
	body: Joi.object({
		plateNumber: Joi.string().min(4).max(15).required(),
		unit: Joi.string().min(2).max(50).required(),
		type: Joi.string().min(2).max(50).required(),
		status: Joi.string().valid('active', 'inactive').required(),
		assignedOfficerId: Joi.string().optional(),
	}).required(),
	query: Joi.object().length(0),
	params: Joi.object().length(0),
	headers: Joi.object().unknown(true),
})

export const getPatrolcar = Joi.object({
	query: Joi.object({
		id: Joi.string().required(),
	}).required(),
	body: Joi.object().length(0),
	params: Joi.object().length(0),
	headers: Joi.object().unknown(true),
})

export const updatePatrolcar = Joi.object({
	query: Joi.object({
		id: Joi.string().required(),
	}).required(),
	body: Joi.object({
		plateNumber: Joi.string().min(4).max(15).optional(),
		unit: Joi.string().min(2).max(50).optional(),
		type: Joi.string().min(2).max(50).optional(),
		status: Joi.string().valid('active', 'inactive').optional(),
		assignedOfficerId: Joi.string().optional(),
	})
		.min(1)
		.required(),
	params: Joi.object().length(0),
	headers: Joi.object().unknown(true),
})

export const deletePatrolcar = Joi.object({
	query: Joi.object({
		id: Joi.string().required(),
	}).required(),
	body: Joi.object().length(0),
	params: Joi.object().length(0),
	headers: Joi.object().unknown(true),
})

export const getAllPatrolcars = Joi.object({
	query: Joi.object({
		fields: Joi.string().optional(),
	}),
	body: Joi.object().length(0),
	params: Joi.object().length(0),
	headers: Joi.object().unknown(true),
})
