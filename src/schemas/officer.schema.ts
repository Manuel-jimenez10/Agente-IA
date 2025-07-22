import Joi from 'joi'

export const registerOfficer = Joi.object({
	body: Joi.object({
		name: Joi.string().min(2).max(80).required(),
		lastname: Joi.string().min(2).max(80).required(),
		badgeNumber: Joi.string().min(2).max(20).required(),
		rank: Joi.string().min(2).max(50).required(),
		phone: Joi.string()
			.pattern(/^(\+\d{1,3})?\d{7,14}$/)
			.required(),
		status: Joi.string().valid('active', 'inactive').required(),
	}).required(),
	query: Joi.object().length(0),
	params: Joi.object().length(0),
	headers: Joi.object().unknown(true),
})

export const getOfficer = Joi.object({
	query: Joi.object({
		id: Joi.string().required(),
	}).required(),
	body: Joi.object().length(0),
	params: Joi.object().length(0),
	headers: Joi.object().unknown(true),
})

export const updateOfficer = Joi.object({
	query: Joi.object({
		id: Joi.string().required(),
	}).required(),
	body: Joi.object({
		name: Joi.string().min(2).max(80).optional(),
		lastname: Joi.string().min(2).max(80).optional(),
		badgeNumber: Joi.string().min(2).max(20).optional(),
		rank: Joi.string().min(2).max(50).optional(),
		phone: Joi.string()
			.pattern(/^(\+\d{1,3})?\d{7,14}$/)
			.optional(),
		status: Joi.string().valid('active', 'inactive').optional(),
	})
		.min(1)
		.required(),
	params: Joi.object().length(0),
	headers: Joi.object().unknown(true),
})

export const deleteOfficer = Joi.object({
	query: Joi.object({
		id: Joi.string().required(),
	}).required(),
	body: Joi.object().length(0),
	params: Joi.object().length(0),
	headers: Joi.object().unknown(true),
})

export const getAllOfficers = Joi.object({
	query: Joi.object({
		fields: Joi.string().optional(), 
	}),
	body: Joi.object().length(0),
	params: Joi.object().length(0),
	headers: Joi.object().unknown(true),
})