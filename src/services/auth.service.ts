import { Response, Request } from 'express';
import { v4 as uuidv4 } from 'uuid';
import * as error from '@utils/error'
import * as config from '@config/config'
import * as tokenUtils from '@utils/token'
import * as userService from '@services/user.service'
import * as emailService from '@services/email.service'
import * as settingService from '@services/setting.service'
import * as loginHelper from '@utils/login'
import { authModel } from '@models/auth.model';

export async function register(email: string, phone: string, name: string, lastname: string): Promise<any> {
	try {
		const user = await userService.getUser({ email })
		
		if (user) {
			throw { code: 400, message: 'Correo ya Existe' }
		}

		const userId = uuidv4()
		const token = await tokenUtils.createActivationToken({ userId, email, phone, name, lastname })

		const emailToSend = {
			from: 'Whatsappia',
			to: email,
			subject: 'Activación de cuenta',
			html: `Hola ${name}, Para activar tu cuenta, haz clic en el siguiente enlace: ${config.FRONTEND_URL}/activate-account?token=${token} Si no solicitaste este registro, ignora este correo.`,
		}

		await emailService.sendActivationEmail(emailToSend)
	} catch (e: any) {
		throw await error.createError(e)
	}
}

export async function activateAccount(token: string): Promise<{ id: string }> {
	try {
		const { userId, email, phone, name, lastname } = await tokenUtils.verifyActivationToken(token)
		const now = new Date()

		await authModel.insertOne({ userId, createdAt: now })
		await userService.registerUser( userId, now, email, phone, name, lastname, )
		await settingService.initializeUserSettings(userId, now)

		return { id: userId }
	} catch (e: any) {
		throw await error.createError(e)
	}
}  

export async function loginFlow( id: string, clientId: string, res: Response ): Promise<{ email: string; phone: string; sessionId: string; settings: any; token: string; }> {
	try {
		const { userId, sessionId } = await loginHelper.login(id)
		const response = await loginHelper.processLogin(userId, clientId, sessionId)

		res.cookie('accessToken', response.token, {
			httpOnly: true,
			secure: false,
			maxAge: 2 * 60 * 60 * 1000,
		})

		return response
	} catch (e: any) {
		throw await error.createError(e)
	}
}

export async function getAuthenticatedUser(req: Request, ): Promise<{ user: any }> {
	try {
		const token = req.cookies.accessToken
		const userId = await tokenUtils.extractUserIdFromToken(token)

		if (!userId) {
			throw { code: 401, message: 'No se pudo validar el usuario' }
		}

		const user = await userService.getUser({ _id: userId })

		return { user }
	} catch (error: any) {
		throw await error.createError(error)
	}
}