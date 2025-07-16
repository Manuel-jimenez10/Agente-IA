import jwt from 'jsonwebtoken';
import * as error from '@utils/error'
import * as config from '@config/config'

interface ActivationPayload {
	userId: string
	email: string
	phone: string
	name: string
	lastname: string
}

export async function createActivationToken(data: ActivationPayload): Promise<string> {
	try {
		const ACTIVATION_SECRET = config.ACTIVATION_SECRET

		if (!ACTIVATION_SECRET) {
			throw { code: 401, message: 'Missing ACTIVATION_SECRET' }
		}

		return jwt.sign(data, ACTIVATION_SECRET, { expiresIn: '1h' })
	} catch (e: any) {
		throw await error.createError(e)
	}
}

export async function verifyActivationToken(token: string): Promise<ActivationPayload> {
	try {
		const ACTIVATION_SECRET = config.ACTIVATION_SECRET

		if (!ACTIVATION_SECRET) {
			throw { code: 401, message: 'Missing ACTIVATION_SECRET' }
		}

		return jwt.verify(token, ACTIVATION_SECRET) as ActivationPayload
	} catch (e: any) {
		throw await error.createError(e)
	}
}

export async function extractUserIdFromToken(token: string): Promise<string> {
	try {
		const payload = jwt.verify(token, config.JWT_SECRET) as { userId: string }
		return payload.userId
	} catch (err) {
		throw { code: 401, message: 'Token inválido o expirado' }
	}
}
  