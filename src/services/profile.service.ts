import path from 'path';
import fs from 'fs/promises';
import * as error from '@utils/error';
import * as avatar from '@utils/avatar';
import * as generator from '@utils/generator';
import { profileModel } from '@models/profile.model';

export async function createProfile(userId: string): Promise<{ message: string }> {
  try {
    await profileModel.insertOne({ userId, bio: '', avatar: '', location: '', social: {}, createdAt: new Date(), });

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

export async function uploadAvatar(userId: string, file: Express.Multer.File): Promise<string> {
  try {
		await avatar.validateAvatarFile(file)

		const ext = path.extname(file.originalname).toLowerCase()
		const fileId = `${await generator.generateFileId()}${ext}`
		const filePath = path.join(process.cwd(), 'storage/avatars', fileId)

		await fs.writeFile(filePath, file.buffer)

		await profileModel.updateOne(
			{ userId },
			{ avatar: fileId, updatedAt: new Date() },
		)
		return fileId
  } catch (e: any) {
    throw await error.createError(e);
  }
}

export async function updateAvatar(userId: string, file: Express.Multer.File): Promise<string> {
  try {
		await avatar.validateAvatarFile(file)
		const profile = await profileModel.findOne({ userId })
		if (!profile) {
			throw { code: 404, message: 'Perfil no encontrado' }
		}

		if (profile.avatar) {
			const oldPath = path.join(
				process.cwd(),
				'storage/avatars',
				profile.avatar,
			)
			await fs.rm(oldPath, { force: true })
		}

		const ext = path.extname(file.originalname).toLowerCase()
		const fileId = `${await generator.generateFileId()}${ext}`
		const filePath = path.join(process.cwd(), 'storage/avatars', fileId)

		await fs.writeFile(filePath, file.buffer)

		await profileModel.updateOne(
			{ userId },
			{ avatar: fileId, updatedAt: new Date() },
		)

		return fileId 
  } catch (e: any) {
    throw await error.createError(e);
  }
}

export async function deleteAvatar(userId: string): Promise<{ message: string }> {
  try {
    const profile = await profileModel.findOne({ userId });
    if (!profile || !profile.avatar) {
      throw { code: 404, message: 'No hay avatar que eliminar' };
    }

    const filePath = path.join(process.cwd(), 'storage/avatars', profile.avatar);
    await fs.rm(filePath, { force: true });

    await profileModel.updateOne(
      { userId },
      { avatar: '', updatedAt: new Date() }
    );

    return { message: 'Avatar eliminado correctamente' };
  } catch (e: any) {
    throw await error.createError(e);
  }
}
