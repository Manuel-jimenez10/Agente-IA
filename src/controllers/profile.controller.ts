import * as error from '@utils/error';
import * as profileService from '@services/profile.service';

export async function getProfiles(): Promise<{userId: string; bio: string; avatarUrl: string; location: string; social: Record<string, any>; createdAt: Date; }[]> {
	try {
		return await profileService.getProfiles()
	} catch (e: any) {
		throw await error.createError(e)
	}
}

export async function getProfile(userId: string): Promise<{userId: string; bio: string; avatarUrl: string; location: string; social: Record<string, any>; createdAt: Date;}> {
	try {
		return await profileService.getProfile(userId)
	} catch (e: any) {
		throw await error.createError(e)
	}
}

export async function createProfile(userId: string): Promise<{ message: string }> {
  try {
    return await profileService.createProfile(userId)
  } catch (e: any) {
    throw await error.createError(e)
  }
}

export async function updateProfile(userId: string, updateData: Record<string, any> ): Promise<{ message: string }> {
	try {
		await profileService.updateProfile(userId, updateData)
        return { message: 'Perfil actualizado correctamente' }
	} catch (e: any) {
		throw await error.createError(e)
	}
}

export async function deleteProfile(userId: string, ): Promise<{ message: string }> {
	try {
		await profileService.deleteProfile(userId)
        return { message: 'Perfil eliminado correctamente' }
	} catch (e: any) {
		throw await error.createError(e)
	}
}

export async function uploadAvatar(userId: string, file: Express.Multer.File): Promise<{ message: string; avatarUrl: string }> {
  try {
    const avatarUrl = await profileService.uploadAvatar(userId, file);
    return { message: 'Avatar subido exitosamente', avatarUrl };
  } catch (e: any) {
    throw await error.createError(e);
  }
}

export async function updateAvatar(userId: string, file: Express.Multer.File): Promise<{ message: string; avatarUrl: string }> {
  try {
    const avatarUrl = await profileService.updateAvatar(userId, file);
    return { message: 'Avatar actualizado correctamente', avatarUrl };
  } catch (e: any) {
    throw await error.createError(e);
  }
}

export async function deleteAvatar(userId: string): Promise<{ message: string }> {
  try {
    return await profileService.deleteAvatar(userId);
  } catch (e: any) {
    throw await error.createError(e);
  }
}
