import { Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import * as error from '@utils/error'
import * as authService from '@services/auth.service'
import * as userService from '@services/user.service'
import * as settingService from '@services/setting.service'
import * as tokenService from '@services/token.service'
import { sendActivationEmail } from '@utils/email'
import { createActivationToken, verifyActivationToken } from '@utils/token'

export async function register(
	email: string,
	phone: string,
	name: string,
	lastname: string,
): Promise<{ type: string }> {
	try {
		const existingUser = await userService.getUserByEmail(email)

		if (existingUser) {
			throw { code: 409, message: 'Ya existe una cuenta con este correo' }
		}

		const userId = uuidv4()
		const token = createActivationToken({ userId, email, phone, name, lastname })

		await sendActivationEmail(email, token)

		return { type: 'success' }
	} catch (e: any) {
		throw await error.createError(e)
	}
}

export async function activateAccount(
	token: string,
): Promise<{ id: string }> {
	try {
		const { userId, email, phone, name, lastname } = verifyActivationToken(token)
		const { id, now } = await authService.registerAuth(userId)
		await userService.registerUser(userId, now, email, phone, name, lastname)
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

export async function getAuthenticatedUser(
	req: Request,
	res: Response,
): Promise<void> {
	const userId = req.user?.userId

	if (!userId) {
		res.status(401).send('No se pudo validar el usuario')
		return
	}

	const user = await userService.getUserById(userId)

	if (!user) {
		res.status(404).send('Usuario no encontrado')
		return
	}

	res.status(200).send({ user })
}
  