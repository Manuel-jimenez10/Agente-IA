import { Request, Response } from 'express'
import * as error from '@utils/error'
import * as authService from '@services/auth.service'
import * as cacheService from '@services/cache.service'
import * as emailService from '@services/email.service'
import * as userService from '@services/user.service'
import * as settingService from '@services/setting.service'
import * as tokenService from '@services/token.service'
import * as messageService from '@services/message.service'

export async function register(
	email: string,
	phone: string,
): Promise<{ type: string }> {
	try {
		const activationHash = await cacheService.saveUserData(email, phone)
		await emailService.sendAccountActivationEmail(email, activationHash)

		return { type: 'success' }
	} catch (e: any) {
		throw await error.createError(e)
	}
}

export async function activateAccount(
	activationHash: string,
): Promise<{ id: string }> {
	try {
		const { userId, email, phone } =
			await cacheService.getUserDataByActivationHash(activationHash)
		await cacheService.deleteUserData(activationHash)
		const { id, now } = await authService.registerAuth(userId)
		await userService.registerUser(userId, now, email, phone)
		await settingService.initializeUserSettings(userId, now)

		return { id }
	} catch (e: any) {
		throw await error.createError(e)
	}
}

export async function login(
	id: string,
	clientId: string,
): Promise<{
	email: string
	phone: string
	token: string
	sessionId: string
	settings: any
}> {
	try {
		const { userId, sessionId } = await authService.login(id)
		const response = await authService.processLogin(
			userId,
			clientId,
			sessionId,
		)

		return response
	} catch (e: any) {
		throw await error.createError(e)
	}
}

export async function logout(req: Request, res: Response): Promise<void> {
	try {
		res.clearCookie('accessToken', {
			httpOnly: true,
			secure: true
		})

		res.send({ type: 'success' })
	} catch (error: any) {
		res.status(500).send({
			type: 'error',
			message: 'Error al cerrar sesión',
		})
	}
}

export async function refreshToken(
	sub: string,
	clientId: string,
): Promise<{ token: string }> {
	try {
		const userId = await userService.decryptSub(sub)
		const token = await tokenService.createAccessToken(userId, clientId)

		return { token }
	} catch (e: any) {
		console.log(e)
		throw await error.createError(e)
	}
}
