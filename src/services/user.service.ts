import jwt from 'jsonwebtoken'
import { userModel } from '@models/user.model'
import { JWT_SECRET, REFRESH_SECRET } from '@config/config'

export async function registerUser(
	userId: string,
	now: Date,
	email: string,
	phone: string,
) {
	await userModel.insertOne({
		_id: userId,
		email,
		phone,
		createdAt: now,
		isActive: true,
	})
}

export async function decryptSub(sub: string): Promise<string> {
	const payload = jwt.verify(sub, JWT_SECRET) as {
		sub: string
	}
	return payload.sub
}
