import * as error from '@utils/error'
import * as file from '@utils/file'
import * as path from 'path'

export async function getInfo(): Promise<string> {

  try{    

    const filePath = path.join('/opt/venv/aigis/scripts','info.txt');
    const data = await file.read(filePath)

    return data
  
  }catch(e: any){
    throw await error.createError(e)
  }

}
