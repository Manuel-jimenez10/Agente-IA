import fs from 'fs';
import path from 'path';
import * as error from '@utils/error'

export async function read(filePath: string): Promise<string> {
  try {    
  	return await fs.promises.readFile(filePath, 'utf8');
  } catch (e: any) {
    throw await error.createError(e);
  }
}