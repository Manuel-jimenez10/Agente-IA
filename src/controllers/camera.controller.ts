import * as cameraService from '@services/camera.service';
import * as error from '@utils/error';
import { ObjectId } from 'mongodb';

export async function registerCamera(name: string, location: string, status: string, ): Promise<{ message: string }> {
	try {
		await cameraService.registerCamera(name, location, status)
		return { message: 'Cámara registrada correctamente' }
	} catch (e: any) {
		throw await error.createError(e)
	}
}

export async function getCamera(id: string): Promise<any> {
	try {
		return await cameraService.getCamera({ _id: new ObjectId(id) })
	} catch (e: any) {
		throw await error.createError(e)
	}
}

export async function getCameras(): Promise<any> {
	try {
		return await cameraService.getAllCameras()
	} catch (e: any) {
		throw await error.createError(e)
	}
}

export async function updateCamera(id: string, updateData: Record<string, any>, ): Promise<{ message: string }> {
	try {
		return await cameraService.updateCamera(id, updateData)
	} catch (e: any) {
		throw await error.createError(e)
	}
}

export async function deleteCamera(id: string): Promise<{ message: string }> {
	try {
		return await cameraService.deleteCamera(id)
	} catch (e: any) {
		throw await error.createError(e)
	}
}
