import * as error from '@utils/error'
import { cameraModel } from '@models/camera.model'
import { ObjectId } from 'mongodb'

export async function registerCamera(name: string, location: string, status: string, ): Promise<void> {
	try {
		if (!name || !location || !status) {
			throw { code: 400, message: 'DATA_NOT_FOUND' }
		}

		await cameraModel.insertOne({
			name,
			location,
			status,
			createdAt: new Date(),
			updatedAt: new Date(),
		})
	} catch (e: any) {
		throw await error.createError(e)
	}
}

export async function getCamera(filter: Record<string, any>): Promise<any> {
	try {
		const camera = await cameraModel.findOne(filter)
		return camera || null
	} catch (e: any) {
		throw await error.createError(e)
	}
}

export async function getAllCameras(fields: string[] = []): Promise<any[]> {
	try {
		return await cameraModel.find({}, fields)
	} catch (e: any) {
		throw await error.createError(e)
	}
}

export async function updateCamera(id: string, updateData: Record<string, any>, ): Promise<{ message: string }> {
	try {
		const updatedFields = {
			...updateData,
			updatedAt: new Date(),
		}

		const result = await cameraModel.updateOne(
			{ _id: new ObjectId(id) },
			updatedFields,
		)
		if (!result) {
			throw {
				code: 404,
				message: 'Cámara no encontrada o sin campos válidos',
			}
		}
		return { message: 'Datos actualizados correctamente' }
	} catch (e: any) {
		throw await error.createError(e)
	}
}

export async function deleteCamera(id: string): Promise<{ message: string }> {
	try {
		const result = await cameraModel.deleteOne({ _id: new ObjectId(id) })
		if (!result) {
			throw { code: 404, message: 'Cámara no encontrada' }
		}
		return { message: 'Cámara eliminada correctamente' }
	} catch (e: any) {
		throw await error.createError(e)
	}
}
  