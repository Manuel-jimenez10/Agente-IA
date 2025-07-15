import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { authModel } from '@models/auth.model';
import { userModel } from '@models/user.model';
import { settingModel } from '@models/setting.model';
import { JWT_SECRET } from '@config/config';

export async function registerAuth(
	userId: string,
): Promise<{ id: string; now: Date }> {
	try {
		const now = new Date()
		await authModel.insertOne({ userId, createdAt: now })
		return { id: userId, now }
	} catch (error: any) {
		throw { code: 500, message: error.message || 'Error en registerAuth' }
	}
}
  

export async function login(
	id: string,
): Promise<{ userId: string; sessionId: string }> {
	try {
		const user = await userModel.findOne({ _id: id })

		if (!user) {
			throw { code: 404, message: 'Usuario no encontrado' }
		}

		const sessionId = uuidv4()
		return { userId: user._id, sessionId }
	} catch (error: any) {
		throw { code: 500, message: error.message || 'Error en login' }
	}
}
  

export async function processLogin(
	userId: string,
	clientId: string,
	sessionId: string,
) {
	try {
		const user = await userModel.findOne({ _id: userId })
		const settings = await settingModel.findOne({ userId })

		if (!user) {
			throw { code: 404, message: 'Usuario no encontrado' }
		}

		const token = jwt.sign(
			{ userId, clientId, sessionId },
			JWT_SECRET as string,
			{ expiresIn: '2h' },
		)

		return {
			email: user.email,
			phone: user.phone,
			token,
			sessionId,
			settings,
		}
	} catch (error: any) {
		throw { code: 500, message: error.message || 'Error en processLogin' };
	}
}
  