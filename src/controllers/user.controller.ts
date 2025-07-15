import * as userService from '@services/user.service'

export async function getUsers(): Promise<{ users: any[] }> {
	try {
		const users = await userService.getAllUsers([
			'_id',
			'email',
			'phone',
			'name',
			'lastname',
		])

		return { users }
	} catch (error: any) {
		throw {
			code: 500,
			message: error.message || 'Error al obtener usuarios',
		}
	}
}  

export async function getUserById(id: string): Promise<{ user: any }> {
	try {
		const user = await userService.getUserByIdParam(id)

		if (!user) {
			throw { code: 404, message: 'Usuario no encontrado' }
		}

		return { user }
	} catch (error: any) {
		throw {
			code: 500,
			message: error.message || 'Error al obtener usuario',
		}
	}
}  

export async function updateUser(
	id: string,
	updateData: Record<string, any>,
): Promise<{ message: string }> {
	try {
		const updated = await userService.updateUserById(id, updateData)

		if (!updated) {
			throw {
				code: 404,
				message: 'Usuario no encontrado o sin campos válidos',
			}
		}

		return { message: 'Datos actualizados correctamente' }
	} catch (error: any) {
		throw {
			code: error.code || 500,
			message: error.message || 'Error en la actualización',
		}
	}
}
  

export async function deleteUser(id: string): Promise<{ message: string }> {
	try {
		const deleted = await userService.deleteUserById(id)

		if (!deleted) {
			throw { code: 404, message: 'Usuario no encontrado' }
		}

		return { message: 'Usuario eliminado correctamente' }
	} catch (error: any) {
		throw {
			code: error.code || 500,
			message: error.message || 'Error al eliminar usuario',
		}
	}
}  
  
  
  