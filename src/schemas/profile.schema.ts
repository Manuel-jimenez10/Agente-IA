import Joi from 'joi';

export const profilesSchema = Joi.object({
	params: Joi.object().length(0),
	query: Joi.object().length(0),
	body: Joi.object().length(0),
	headers: Joi.object().unknown(true),
})

export const createProfileSchema = Joi.object({
	body: Joi.object({
		userId: Joi.string().length(24).required(),
	}),
	params: Joi.object().length(0),
	query: Joi.object().length(0),
	headers: Joi.object().unknown(true),
})

export const profileSchema = Joi.object({
	params: Joi.object().length(0),
	query: Joi.object({
		id: Joi.string().required(),
	}),
	body: Joi.object().length(0),
	headers: Joi.object().unknown(true),
})

export const updateProfileSchema = Joi.object({
	params: Joi.object().length(0),
	query: Joi.object({
		id: Joi.string().required(),
	}),
	body: Joi.object({
		bio: Joi.string().max(500).optional(),
		avatarUrl: Joi.string().uri().optional(),
		location: Joi.string().max(100).optional(),
		social: Joi.object().optional(),
	})
		.min(1)
		.required(),
	headers: Joi.object().unknown(true),
})

export const deleteProfileSchema = Joi.object({
	params: Joi.object().length(0),
	query: Joi.object({
		id: Joi.string().required(),
	}),
	body: Joi.object().length(0),
	headers: Joi.object().unknown(true),
})