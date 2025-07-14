import { JWT_SECRET } from '@config/config';
import jwt from 'jsonwebtoken';

export function createAccessToken(userId: string, clientId: string): string {
	return jwt.sign({ userId, clientId }, JWT_SECRET, {
		expiresIn: '15m',
	})
};
