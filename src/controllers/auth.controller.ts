import { Request, Response } from 'express'
import * as error from '@utils/error'
import * as authService from '@services/auth.service'
import * as userService from '@services/user.service'
import * as tokenService from '@services/token.service'
import * as cookieService from '@services/cookie.service'

export async function register(email: string, phone: string, name: string, lastname: string ): Promise<{ type: string }> {
	try {
		await authService.register(email, phone, name, lastname)
		return { type: 'success' }
	} catch (e: any) {
		throw await error.createError(e)
	}
}

export async function activateAccount(token: string): Promise<{ id: string }> {
	try {
		const response = await authService.activateAccount(token)
		return response
	} catch (e: any) {
		throw await error.createError(e)
	}
}  

export async function login(id: string, clientId: string, res: Response, ): Promise<{ email: string; phone: string; sessionId: string; settings: any; token: string }> {
	try {
		const response = await authService.loginFlow(id, clientId, res)
		return response
	} catch (e: any) {
		throw await error.createError(e)
	}
}

export async function logout(): Promise<{ type: string }> {
	try {
		return { type: 'success' }
	} catch (e: any) {
		throw await error.createError(e)
	}
}  

export async function refreshToken(sub: string, clientId: string, res: Response ): Promise<{token: string}> {
	try {
		const userId = await userService.decryptSub(sub)
		const token = await tokenService.createAccessToken(userId, clientId)
		await cookieService.setAccessTokenCookie(res, token)
		
		return { token }
	} catch (e: any) {
		throw await error.createError(e)
	}
}

export async function getAuthenticatedUser(req: Request): Promise<{ user: any }> {
	try {
		return await authService.getAuthenticatedUser(req)
	} catch (error: any) {
		throw await error.createError(error)
	}
}
  
  
  