import * as error from '@utils/error'
import * as whatsapp from '@utils/whatsapp'
import * as config from '@config/config'
import * as llm from '@utils/llm'
import * as audio from '@utils/audio'
import * as image from '@utils/image'
import * as whitelist from '@utils/whitelist'
import { messageModel } from '@models/message.model'
import path from 'path';
import fs from 'fs';
import OpenAI from "openai";

export async function saveMessage(message: any): Promise<any>{

  try{

    let content

    const systemContext = await llm.getSystemContext();

    if(message.type == "text"){
      content = { "body": message.text.body }
    }
    if(message.type == "audio"){
      const mediaUrl = await whatsapp.getMediaUrl(message.audio.id)                  
      const audioBuffer = await whatsapp.downloadAudio(mediaUrl);                   
      const wavBuffer = await audio.convertAudioToWav(audioBuffer); 
      const transcription = await audio.transcribeAudioWithVosk(wavBuffer);

      content = { "transcription": transcription }
    }
    if(message.type == "image"){

      // Guardar en disco la imágen enviada a Whatsapp
      await whatsapp.downloadImage(message.image.id, message.image.mime_type)

      const ext = message.image.mime_type.split("/")[1];
      const imagePath = path.join(__dirname, '../../storage/whatsapp', `${message.image.id}.${ext}`);
      const base64Image = await image.convertImageToBase64(imagePath)

      const messages: OpenAI.ChatCompletionMessageParam[] = [
        {
          role: "system",
          content: systemContext.trim(),
        },
        {
          role: "user",
          content: "Analiza esta imagen con el mayor nivel de detalle posible. Describe absolutamente todo lo que puedas observar, incluyendo: objetos visibles, colores predominantes, formas, texturas, fondo, distribución espacial, iluminación, expresiones faciales (si hay personas), ropa, contexto, estilo visual y cualquier otro elemento significativo. No omitas ningún detalle, incluso si parece irrelevante. Además, si es posible, intenta inferir el propósito de la imagen o el mensaje que transmite."
        }
      ];

      const description = await llm.generateResponse(messages)

      content = { 
        ...(message.image.caption ? { caption: message.image.caption } 
          : 
          {}),
        "name": `${message.image.id}.${ext}`,
        "description": description
      }
      
    }
    if( message.type == "location" ){
      content = {
        timestamp: message.timestamp,
        location: message.location
      }
    }

    const _message = {
      "createdAt": new Date(),
      "from": message.from,
      "to": config.AGENT_TELEPHONE_NUMBER,
      "type": "question",
      "contentType": message.type,
      "content": content
    }
    await messageModel.insertOne(_message)

    return _message

  }catch(e){    
    throw await error.createError(e)
  }

}

export async function sendMessage(response: any, to: string): Promise<void> {

  try{

    // Enviar por Whatsapp la respuesta al usuario
    let content: { type: string; [key: string]: any } = {
      type: response.contentType
    };

    switch (response.contentType) {
      case "audio": {
        const audioBuffer = await audio.textToSpeechBuffer(response.content.transcription)
        const audioId = await whatsapp.uploadAudio(config.WHATSAPP_ACCESS_TOKEN, audioBuffer);      
        content.audioId = audioId
        break;
      }
      case "text": {
        content.body = response.content.body;        
        break;
      }
      case "image": {
        const imagePath = path.join(__dirname, '../../storage/whatsapp', `${response.content.name}`);
        const mediaId = await whatsapp.uploadImage(imagePath)
        content.mediaId = mediaId
        content.caption = response.content.caption
        break;
      }
      case "interactive": {
        content.body = response.content.body;
        break;
      }
     
    }
  
    await whatsapp.send(config.WHATSAPP_ACCESS_TOKEN, config.WHATSAPP_PHONE_NUMBER_ID, to, content)
  
  }catch(e: any){
    throw await error.createError(e)
  }

}

export async function saveResponse(response: any): Promise<void>{
    
  try{   
    await messageModel.insertOne(response)
  }catch(e){
    throw await error.createError(e)
  }

}

export async function verifyMessage(object: string, messages: any): Promise<void> {

  try{
    
    if (object !== 'whatsapp_business_account') {
      throw { code: 404, message: "WHATSAPP_NOT_FOUND" };
    }

    if (!messages || messages.length === 0) {
      throw { code: 400, message: "WHATSAPP_NOT_MESSAGES" };
    }

  }catch(e: any){               
    throw await error.createError(e)
  }

}

export async function verifyWebhook(mode: string, token: string, challenge: string){

  try{

    if (mode === 'subscribe' && token === config.WHATSAPP_WEBHOOK_VERIFY_TOKEN) {
      return challenge
    } else {
      throw { code: 403, message: "Forbidden" }      
    }

  }catch(e){
    throw await error.createError(e)
  }

}

export async function sendTypingIfText(to: string, messageId: string, type: string): Promise<void>{

  try{   
    await whatsapp.sendTyping(to, messageId, type)
  }catch(e){
    throw await error.createError(e)
  }

}

export async function isWhitelisted(telephoneNumber: string): Promise<void>{

  try{   
    const isAllowed = await whitelist.isWhitelisted(telephoneNumber)
    if(!isAllowed){
      throw { code: 400, message: "not allowed" }
    }
  }catch(e){
    throw await error.createError(e)
  }

}

