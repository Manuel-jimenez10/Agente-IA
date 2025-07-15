import { Request, Response } from 'express'
import * as userService from '@services/user.service'

export async function getUsers(req: Request, res: Response): Promise<void> {
	try {
		const users = await userService.getAllUsers(['_id', 'email', 'phone', 'name', 'lastname'])
		res.status(200).send({ users })
	} catch (error: any) {
		res.status(error.code || 500).send(
			error.message || 'Error al obtener usuarios',
		)
	}
}

export async function getUserById(req: Request, res: Response): Promise<void> {
	try {
		const { id } = req.params
		const user = await userService.getUserByIdParam(id)

		if (!user) {
			res.status(404).send('Usuario no encontrado')
			return
		}

		res.status(200).send({ user })
	} catch (error: any) {
		res.status(error.code || 500).send(
			error.message || 'Error al obtener usuario',
		)
	}
}

export async function updateUser(req: Request, res: Response): Promise<void> {
	try {
		const { id } = req.params
		const updateData = req.body

		const updated = await userService.updateUserById(id, updateData)

		if (!updated) {
			res.status(404).send('Usuario no encontrado o sin campos válidos')
			return
		}

		res.status(200).send({ message: 'Datos actualizados correctamente' })
	} catch (error: any) {
		res.status(error.code || 500).send(
			error.message || 'Error en la actualización',
		)
	}
}  

export async function deleteUser(req: Request, res: Response): Promise<void> {
	try {
		const { id } = req.params

		const deleted = await userService.deleteUserById(id)

		if (!deleted) {
			res.status(404).send('Usuario no encontrado')
			return
		}

		res.status(200).send({ message: 'Usuario eliminado correctamente' })
	} catch (error: any) {
		res.status(error.code || 500).send(
			error.message || 'Error al eliminar usuario',
		)
	}
}  
  
  
  