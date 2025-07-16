import * as error from '@utils/error'
import * as userService from '@services/user.service'

export async function getUsers(): Promise<{ users: any[] }> {
	try {
		const users = await userService.getAllUsers(['_id','email','phone','name','lastname',])

		return { users }
	} catch (e: any) {
		throw await error.createError(e)
	}
}

export async function getUser(id: string): Promise<{ user: any }> {
	try {
		const user = await userService.getUser({_id: id})

		return { user }
	} catch (e: any) {
		throw await error.createError(e)
	}
}

export async function updateUser(id: string, updateData: Record<string, any>,): Promise<{ message: string }> {
	try {
		const response = await userService.updateUser(id, updateData)
		return response
	} catch (e: any) {
		throw await error.createError(e)
	}
}

export async function deleteUser(id: string): Promise<{ message: string }> {
	try {
		const response = await userService.deleteUser(id)
		return response
	} catch (e: any) {
		throw await error.createError(e)
	}
}
  
