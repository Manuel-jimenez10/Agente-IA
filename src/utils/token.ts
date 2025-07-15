import jwt from 'jsonwebtoken';

interface ActivationPayload {
	userId: string
	email: string
	phone: string
}

export function createActivationToken(data: ActivationPayload): string {
	const ACTIVATION_SECRET = process.env.ACTIVATION_SECRET

	if (!ACTIVATION_SECRET) {
		throw new Error('Missing ACTIVATION_SECRET')
	}

	return jwt.sign(data, ACTIVATION_SECRET, { expiresIn: '1h' })
}

export function verifyActivationToken(token: string): ActivationPayload {
	const ACTIVATION_SECRET = process.env.ACTIVATION_SECRET

	if (!ACTIVATION_SECRET) {
		throw new Error('Missing ACTIVATION_SECRET')
	}

	return jwt.verify(token, ACTIVATION_SECRET) as ActivationPayload
}
