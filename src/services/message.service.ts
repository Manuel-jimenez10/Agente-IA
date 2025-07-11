import * as error from '@utils/error'
import { messageModel } from '@models/message.model'
import * as whitelist from '@utils/whitelist'
import * as config from '@config/config'

export async function getMessages(): Promise<any> {

  try{    
    return await messageModel.find({})
  }catch(e: any){
    throw await error.createError(e)
  }

}

export async function chatMessageDispatcher(): Promise<any> {

  try{    
    const messages = await messageModel.find({})
    const _whitelist = await whitelist.getWhitelist()

    const messagesWithContactName = messages.map(msg => {
      
      const contactNumber = msg.from;      
      const contact = _whitelist.find(entry => entry.telephoneNumber === contactNumber);

      return {
        ...msg.toObject?.() ?? msg,
        contactName: contact?.name || 'Aigis IA'
      };
    });

    return messagesWithContactName

  }catch(e: any){
    throw await error.createError(e)
  }

}
