import * as officerService from '@services/officer.service';
import * as error from '@utils/error';
import { ObjectId } from 'mongodb';

export async function registerOfficer(name: string, lastname: string, badgeNumber: string, rank: string, phone: string, status: string): Promise<{ message: string }> {
	try {
		await officerService.registerOfficer(
			name,
			lastname,
			badgeNumber,
			rank,
			phone,
			status,
		)
		return { message: 'Efectivo registrado correctamente' }
	} catch (e: any) {
		throw await error.createError(e)
	}
}

export async function getOfficer(id: string): Promise<any> {
	try {
		return await officerService.getOfficer({ _id: new ObjectId(id) })
	} catch (e: any) {
		throw await error.createError(e)
	}
}

export async function getAllOfficers(fields: string[]): Promise<any[]> {
	try {
		return await officerService.getAllOfficers(fields)
	} catch (e: any) {
		throw await error.createError(e)
	}
}

export async function updateOfficer(
	id: string,
	updateData: Record<string, any>,
): Promise<{ message: string }> {
	try {
		return await officerService.updateOfficer(id, updateData)
	} catch (e: any) {
		throw await error.createError(e)
	}
}

export async function deleteOfficer(id: string): Promise<{ message: string }> {
	try {
		return await officerService.deleteOfficer(id)
	} catch (e: any) {
		throw await error.createError(e)
	}
}
