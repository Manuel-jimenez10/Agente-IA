import path from 'path';
import * as error from '@utils/error'

export async function validateAvatarFile(file?: Express.Multer.File): Promise<void> {
  try {
    if (!file) {
      throw { code: 400, message: 'Archivo requerido (avatar)' };
    }

    const ext = path.extname(file.originalname).toLowerCase();
    const valid = ['.png', '.jpg', '.jpeg'];
    if (!valid.includes(ext)) {
      throw { code: 400, message: 'Formato inválido. Usa PNG, JPG o JPEG' };
    }

    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      throw { code: 400, message: 'El archivo supera el límite de 2 MB' };
    }
  } catch(e: any){
      throw await error.createError(e)
    }
}