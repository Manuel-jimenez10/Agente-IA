import * as error from '@utils/error'
import * as whatsappService from '@services/whatsapp.service';
import * as socketService from '@services/socket.service';
import * as llmService from '@services/llm.service';

export async function verifyWebhook(mode: string, token: string, challenge: string) {

  try{
    return await whatsappService.verifyWebhook(mode, token, challenge)
  }catch(e){
    throw await error.createError(e)
  }

}

export async function handleWebhook(object: string, metadata: any, profile: any, messages: any) {
   
  try{
    // Verifica si el número de teléfono esta en la lista blanca
    //await whatsappService.isWhitelisted(messages[0].from)
    await whatsappService.verifyMessage(object, messages)      
    await whatsappService.sendTypingIfText(messages[0].from, messages[0].id, messages[0].type);    

    const _message = await whatsappService.saveMessage(messages[0])      
    await socketService.emitMessage(_message)
      
    const response = await llmService.generateResponse(_message)      

    await whatsappService.saveResponse(response)      
    await socketService.sendMessageToClient(_message) // Alerta y ubicación
    
    await whatsappService.sendMessage(response, _message.from)      
    await socketService.emitResponse(response)

  }catch(e: any){                 
    throw await error.createError(e)
  }

}