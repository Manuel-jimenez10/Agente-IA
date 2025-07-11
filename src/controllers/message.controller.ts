import * as error from '@utils/error'
import * as messageService from '@services/message.service'

export async function getMessages(): Promise<any> {
  
  try{                              
    return await messageService.getMessages()
  }catch(e: any){
    throw await error.createError(e)
  }

}

export async function chatMessageDispatcher(): Promise<any> {
  
  try{                                  
    return await messageService.chatMessageDispatcher()
  }catch(e: any){
    throw await error.createError(e)
  }

}