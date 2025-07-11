import * as error from '@utils/error'
import path from 'path';
import fs from 'fs';

export async function convertImageToBase64(imagePath: string): Promise<string> {
  try{
    const ext = path.extname(imagePath).replace('.', '')
    const buffer = fs.readFileSync(imagePath);
    const base64Image = `data:image/${ext};base64,${buffer.toString('base64')}`;

    return base64Image

  }catch(e: any){
    throw await error.createError(e)
  }
}