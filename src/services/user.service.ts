import jwt from 'jsonwebtoken'
import * as error from '@utils/error'
import * as config from '@config/config'
import { userModel } from '@models/user.model'

export async function registerUser( userId: string, now: Date, email: string, phone: string, name: string, lastname: string, ): Promise<void> {
	try {
		await userModel.insertOne({ _id: userId, email, phone, name, lastname, createdAt: now, isActive: true })
	} catch (e: any) {
		throw await error.createError(e)
	}
}

export async function getUser(filter: Record<string, any>): Promise<any> {
	try {
		const user = await userModel.findOne(filter)
	
		return user || null
	} catch (e: any) {
		throw await error.createError(e)
	}
}

export async function getAllUsers(fields: string[] = []): Promise<any[]> {
	try {
		return await userModel.find({}, fields)
	} catch (e: any) {
		throw await error.createError(e)
	}
}
  
export async function decryptSub(sub: string): Promise<string> {
	try {
		const payload = jwt.verify(sub, config.JWT_SECRET) as { sub: string }
		return payload.sub
	} catch (e: any) {
		throw await error.createError(e)
	}
}

export async function updateUser(id: string, updateData: Record<string, any>, ): Promise<{ message: string }> {
	try {
		const result = await userModel.updateOne({ _id: id }, updateData)
		if (!result) {
			throw {
				code: 404,
				message: 'Usuario no encontrado o sin campos válidos',
			}
		}
		return { message: 'Datos actualizados correctamente' }
	} catch (e: any) {
		throw await error.createError(e)
	}
}

export async function deleteUser(id: string): Promise<{ message: string }> {
	try {
		const result = await userModel.deleteOne({ _id: id })
		if (!result) {
			throw { code: 404, message: 'Usuario no encontrado' }
		}
		return { message: 'Usuario eliminado correctamente' }
	} catch (e: any) {
		throw await error.createError(e)
	}
}
  