import Joi from 'joi'

export const getAllCameras = Joi.object({
	query: Joi.object().length(0),
	body: Joi.object().length(0),
	params: Joi.object().length(0),
	headers: Joi.object().unknown(true),
})

export const registerCamera = Joi.object({
	body: Joi.object({
		name: Joi.string().min(2).max(80).required(),
		location: Joi.string().min(2).max(100).required(),
		status: Joi.string().valid('active', 'inactive').required(),
	}).required(),
	query: Joi.object().length(0),
	params: Joi.object().length(0),
	headers: Joi.object().unknown(true),
})

export const getCamera = Joi.object({
	query: Joi.object({
		id: Joi.string().required(),
	}).required(),
	body: Joi.object().length(0),
	params: Joi.object().length(0),
	headers: Joi.object().unknown(true),
})

export const updateCamera = Joi.object({
	query: Joi.object({
		id: Joi.string().required(),
	}).required(),
	body: Joi.object({
		name: Joi.string().min(2).max(80).optional(),
		location: Joi.string().min(2).max(100).optional(),
		status: Joi.string().valid('active', 'inactive').optional(),
	})
		.min(1)
		.required(),
	params: Joi.object().length(0),
	headers: Joi.object().unknown(true),
})

export const deleteCamera = Joi.object({
	query: Joi.object({
		id: Joi.string().required(),
	}).required(),
	body: Joi.object().length(0),
	params: Joi.object().length(0),
	headers: Joi.object().unknown(true),
})
