import * as error from '@utils/error'
import { reportModel } from '@models/report.model'

export async function saveInformation(now: Date, data: string, response: string): Promise<void> {

  try{    

    await reportModel.insertOne({
      createdAt: now,      
      data: data,
      information: response
    })      
  
  }catch(e: any){
    throw await error.createError(e)
  }

}
