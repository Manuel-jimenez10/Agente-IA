import jwt from 'jsonwebtoken'
import { userModel } from '@models/user.model'
import { JWT_SECRET } from '@config/config'

export async function registerUser(
	userId: string,
	now: Date,
	email: string,
	phone: string,
	name: string,
	lastname: string,
): Promise<void> {
	try {
		await userModel.insertOne({
			_id: userId,
			email,
			phone,
			name,
			lastname,
			createdAt: now,
			isActive: true,
		})
	} catch (error: any) {
		throw {
			code: 500,
			message: error?.message || 'Error al registrar el usuario',
		}
	}
}

export async function getUserById(userId: string): Promise<any | null> {
	try {
		return await userModel.findOne({ _id: userId })
	} catch (error: any) {
		throw {
			code: 500,
			message: error.message || 'Error al buscar usuario por ID',
		}
	}
}

export async function getUserByEmail(email: string): Promise<any | null> {
	try {
		return await userModel.findOne({ email })
	} catch (error: any) {
		throw {
			code: 500,
			message: error.message || 'Error al buscar usuario por email',
		}
	}
}

export async function getAllUsers(fields: string[] = []): Promise<any[]> {
	try {
		return await userModel.find({}, fields)
	} catch (error: any) {
		throw {
			code: 500,
			message: error.message || 'Error al obtener listado de usuarios',
		}
	}
}

export async function updateUserById(
	id: string,
	updateData: Record<string, any>,
): Promise<boolean> {
	try {
		const result = await userModel.updateOne({ _id: id }, updateData)
		return result.matchedCount > 0
	} catch (error: any) {
		throw {
			code: 500,
			message: error.message || 'Error al actualizar el usuario',
		}
	}
}
  
export async function getUserByIdParam(id: string): Promise<any | null> {
	try {
		return await userModel.findOne({ _id: id }, [
			'_id',
			'email',
			'phone',
			'name',
			'lastname',
		])
	} catch (error: any) {
		throw {
			code: 500,
			message: error.message || 'Error al obtener el usuario',
		}
	}
}
  
export async function decryptSub(sub: string): Promise<string> {
	try {
		const payload = jwt.verify(sub, JWT_SECRET) as { sub: string }
		return payload.sub
	} catch (error: any) {
		throw { code: 401, message: 'Token inválido o expirado' }
	}
}

export async function deleteUserById(id: string): Promise<boolean> {
	try {
		const result = await userModel.deleteOne({ _id: id })
		return result.deletedCount > 0
	} catch (error: any) {
		throw {
			code: 500,
			message: error.message || 'Error al eliminar el usuario',
		}
	}
}