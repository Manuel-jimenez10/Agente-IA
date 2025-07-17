import { v4 as uuidv4 } from 'uuid'
import * as error from '@utils/error'
import * as userService from '@services/user.service'
import * as settingService from '@services/setting.service'
import * as tokenService from '@services/token.service';

export async function login(email: string ): Promise<{ userId: string; sessionId: string }> {
	try {
		const user = await userService.getUser({ email: email })

		if (!user) {
			throw { code: 404, message: 'Usuario no encontrado' }
		}

		const sessionId = uuidv4()
		return { userId: user._id, sessionId }
	} catch (e: any) {
		throw await error.createError(e)
	}
}

export async function processLogin(userId: string, clientId: string, sessionId: string, ) {
	try {
		const user = await userService.getUser({ _id: userId })
		const settings = await settingService.getUserSettings(userId)

		if (!user) {
			throw { code: 404, message: 'Usuario no encontrado' }
		}

		const token = await tokenService.createAccessToken(userId, clientId, sessionId)

		return {
			email: user.email,
			phone: user.phone,
			token,
			sessionId,
			settings,
		}
	} catch (e: any) {
		throw await error.createError(e)
	}
}
