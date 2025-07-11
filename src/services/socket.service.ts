import * as error from '@utils/error'
import * as socket from '@utils/socket'
import * as whitelist from '@utils/whitelist'

export async function sendMessageToClient(message: any): Promise<void> {
  try {
        
    // Alerta
    if( (message.contentType === "text" && message.content.body.toLowerCase() == "alerta") || (message.contentType === "audio" && message.content.transcription.toLowerCase() == "alerta" ) ){
      const eventName = "mensaje"
      await socket.broadcastMessage(eventName, message)
    }

    // Ubicación
    if( message.contentType == "location" ){

      const eventName = "ubicacion"      
      const _message = JSON.stringify({
        from: message.from,        
        location: message.content.location
      })

      await socket.broadcastMessage(eventName, _message)
    }

  } catch (e: any) {
    throw await error.createError(e);
  }
}

export async function emitMessage(message: any): Promise<void> {
  try {
    
    if( message.contentType === "text" || message.contentType === "audio" ){
      const eventName = "chat-message"
      
      const _whitelist = await whitelist.getWhitelist()

      const contactNumber = message?.from;
      const contact = _whitelist.find(entry => entry.telephoneNumber === contactNumber);

      const messageWithContactName = {
        ...message,
        contactName: contact?.name
      };

      await socket.broadcastMessage(eventName, messageWithContactName)
    }

  } catch (e: any) {
    throw await error.createError(e);
  }
}

export async function emitResponse(response: any): Promise<void> {
  try {        
      const eventName = "chat-response"  

      const _whitelist = await whitelist.getWhitelist()

      const contactNumber = response?.to;
      const contact = _whitelist.find(entry => entry.telephoneNumber === contactNumber);

      const responseWithContactName = {
        ...response,
        contactName: 'Aigis IA'
      };

      await socket.broadcastMessage(eventName, responseWithContactName)    
  } catch (e: any) {
    throw await error.createError(e);
  }
}