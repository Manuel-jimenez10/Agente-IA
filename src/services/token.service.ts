import { JWT_SECRET } from '@config/config';
import jwt from 'jsonwebtoken';

export async function createAccessToken(userId: string, clientId: string, sessionId?: string): Promise<string> {
	const payload: Record<string, any> = { userId, clientId }

	if (sessionId) {
		payload.sessionId = sessionId
	}

	return jwt.sign(payload, JWT_SECRET, {
		expiresIn: '2h',
	})
};
