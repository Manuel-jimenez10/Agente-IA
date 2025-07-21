import * as error from '@utils/error';
import { profileModel } from '@models/profile.model';

export async function createProfile(userId: string): Promise<{ message: string }> {
  try {
    await profileModel.insertOne({ userId, bio: '', avatarUrl: '', location: '', social: {}, createdAt: new Date(), });

    return { message: 'Perfil creado correctamente' }
  } catch (e: any) {
    throw await error.createError(e)
  }
}


export async function getProfiles(): Promise<any> {
	try {
		return await profileModel.find({})
	} catch (e: any) {
		throw await error.createError(e)
	}
}

export async function getProfile(userId: string): Promise<any> {
	try {
		const profile = await profileModel.findOne({ userId })
		if (!profile) {
			throw { code: 404, message: 'Perfil no encontrado' }
		}
		return profile
	} catch (e: any) {
		throw await error.createError(e)
	}
}

export async function updateProfile(userId: string, updateData: Record<string, any>,): Promise<any> {
	try {
		const result = await profileModel.updateOne({ userId }, updateData)
		if (!result) {
			throw {
				code: 404,
				message: 'Perfil no encontrado o sin campos válidos',
			}
		}
	} catch (e: any) {
		throw await error.createError(e)
	}
}

export async function deleteProfile(userId: string): Promise<any> {
	try {
		const result = await profileModel.deleteOne({ userId })
		if (!result) {
			throw { code: 404, message: 'Perfil no encontrado' }
		}
	} catch (e: any) {
		throw await error.createError(e)
	}
}
  