import * as error from '@utils/error'
import * as llm from '@utils/llm'
import * as image from '@utils/image'
import * as stream from '@utils/stream'
import { messageModel } from '@models/message.model'
import path from 'path';
import * as config from '@config/config'
import OpenAI from "openai";
import * as hash from '@utils/hash'
import * as audio from '@utils/audio'
import fs from 'fs';
import { contactModel } from '@models/contact.model'

export async function generateResponse(message: any): Promise<any> {
      
  try{
    
    let prompt = '';
    let base64Image: string | undefined;

    let response = {
      "createdAt": new Date(),
      "from": config.AGENT_TELEPHONE_NUMBER,
      "to": message.from,
      "type": "answer",
      "contentType": "",
      "content": {}
    }

    if (!message?.contentType) {      
      throw { code: 400, message: "El mensaje no tiene 'contentType'" }
    }

    const systemContext = await llm.getSystemContext();

    if( message.contentType == "text" || message.contentType == "audio" ){
      
      // Alerta
      if( (message.contentType == "text" && message.content.body.toLowerCase() == "alerta") || (message.contentType == "audio" && message.content.transcription.toLowerCase() == "alerta") ){
        
        const _response = "Esta alertada la central de monitoreo. Tenemos un patrullero y una ambulancia dirigiendose al lugar de destino. El dron acaba de despegar y se dirige a tu ubicación."
        response.contentType = message.contentType
        response.content = message.contentType === "text" ? { body: _response } : { transcription: _response }
      
        return response
      }

      // Fotograma
      if( (message.contentType == "text" && message.content.body.toLowerCase() == "fotograma") || (message.contentType == "audio" && message.content.transcription.toLowerCase() == "fotograma") ){

        // Lógica para obtener un fotograma y describirlo con llm. Se debe enviar la imágen y el caption (descripción)

        const imagePath = await stream.extractFrameFromLastSegment()                
        base64Image = await image.convertImageToBase64(imagePath)

        const messages: OpenAI.ChatCompletionMessageParam[] = [
          {
            role: "system",
            content: systemContext.trim(),
          },
          {
            role: "user",
            content: "Analiza esta imagen con el mayor nivel de detalle posible. Describe absolutamente todo lo que puedas observar, incluyendo: objetos visibles, colores predominantes, formas, texturas, fondo, distribución espacial, iluminación, expresiones faciales (si hay personas), ropa, contexto, estilo visual y cualquier otro elemento significativo. No omitas ningún detalle, incluso si parece irrelevante. Además, si es posible, intenta inferir el propósito de la imagen o el mensaje que transmite. Sé conciso en la respuesta"
          }
        ];

        const _response = await llm.generateResponse(messages) as any

        response.contentType = "image"
        response.content = {
          caption: _response,
          name: path.basename(imagePath)
        }

        return response

      }

      // Solicitar ubicación al usuario de Whatsapp
      if( 
        (message.contentType == "text" && message.content.body.toLowerCase() == "ubicacion") || 
        (message.contentType == "text" && message.content.body.toLowerCase() == "ubicación") || 
        (message.contentType == "audio" && message.content.transcription.toLowerCase() == "ubicacion") ||
        (message.contentType == "audio" && message.content.transcription.toLowerCase() == "ubicación") 
      ){
       
        const _response = "Solitud de ubicación. Podes ingresar una dirección manualmente o compartir tu ubicación."
       
        response.contentType = "interactive"
        response.content = { body: _response }

        return response
      }

      let conversation = await messageModel.find({})            

      const messages: OpenAI.ChatCompletionMessageParam[] = [
        {
          role: "system",
          content: systemContext.trim(),
        }
      ];

      // Convertimos el historial en mensajes tipo chat            
      for (const msg of conversation.slice(-40)) {
        if (
          msg.from == message.from ||
          msg.to == message.from
        ) {          

          let content = "";
          if (msg.contentType === "text") content = msg.content.body;
          if (msg.contentType === "audio") content = msg.content.transcription;
          if (msg.contentType === "image") {
            const parts = [];
            if (msg.content.caption) parts.push(msg.content.caption);
            if (msg.content.description) parts.push(msg.content.description);
            content = parts.join("\n");
          }

          const role = msg.from === message.from ? "user" : "assistant";
          messages.push({ role, content });
        }
      }

      // Agregamos el mensaje actual del usuario
      const newMessageContent =
        message.contentType === "text"
          ? message.content.body
          : message.content.transcription;

      messages.push({
        role: "user",
        content: newMessageContent
      });    

      // Llamamos al modelo con el array estructurado
      const _response = await llm.generateResponse(messages);   
         
       if (_response.intent === "datosPersonales") {
  try {
    // Busca el contacto por whatsapp.phone
    let contact = await contactModel.findOne({ "whatsapp.phone": message.from });

    const { name, surname, address, whatsapp } = _response;
    const { latitude, longitude } = message.content;

    if (!contact) {
      // Si no existe, lo crea
      const newContact = {
        name: name || "",
        surname: surname || "",
        address: address ||  { latitude, longitude } || "",
        whatsapp: {
          username: message.username || "",
          phone: message.from,
        },
        createdAt: new Date(),
      };
      await contactModel.insertOne(newContact);
    } else {
      // Si existe, lo actualiza
      const updateResult = await contactModel.updateOne(
        { "whatsapp.phone": message.from },
        {
          name: name || contact.name || "",
          surname: surname || contact.surname || "",
          address: address || contact.address || "",
          whatsapp: {
            username: whatsapp?.username || contact.whatsapp?.username || "",
            phone: message.from,
          },
        }
      );
    }
  } catch (err) {
    console.error("Error guardando datos personales:", err);
  }
}
      // Verificar si el agente detectó datos personales

      response.contentType = message.contentType

      if( message.contentType === "text" ){
        response.content = { body: _response.reply }
        return response
      }

      if( message.contentType === "audio" ){
        
        // Guarda el audio en disco
        const audioName = `${await hash.generateRandomName(prompt.toString())}.mp3`
        const audioBuffer = await audio.textToSpeechBuffer(_response)
        const outputPath = path.join(__dirname, '../../storage/whatsapp/audios', audioName); 
        fs.writeFileSync(outputPath, audioBuffer);

        response.content = { 
          transcription: _response,
          name: audioName
        }

        return response
      }

    }

    if( message.contentType == "image" ){

      let _response

      if(message.content.caption){
        const imagePath = path.join(__dirname, '../../storage/whatsapp', `${message.content.name}`);              
        base64Image = await image.convertImageToBase64(imagePath)
        

        const messages: OpenAI.ChatCompletionMessageParam[] = [
          {
            role: "system",
            content: systemContext.trim(),
          },
          {
            role: "user",
            content: message.content.caption
          }
        ];

        _response = await llm.generateResponse(messages) as any        
      }else{
        _response = "¿Qué deseas saber de la imágen?"        
      }

      response.contentType = "text"
      response.content = { body: _response }

      return response
    }

    // Respuesta para la ubicación dle usuario por Whatsapp
    if( message.contentType == "location" ){
        try {
    const { latitude, longitude } = message.content.location;

    // Busca el contacto por whatsapp.phone
    let contact = await contactModel.findOne({ "whatsapp.phone": message.from });

    if (!contact) {
      // Si no existe, lo crea
      const newContact = {
        name: "",
        surname: "",
        address: { latitude, longitude },
        whatsapp: {
          username: message.username || "",
          phone: message.from,
        },
        createdAt: new Date(),
      };
      await contactModel.insertOne(newContact);
    } else {
      // Si existe, lo actualiza
      const updateResult = await contactModel.updateOne(
        { "whatsapp.phone": message.from },
        {
          address: { latitude, longitude },
        }
      );
    }

    // Prepara el mensaje para el LLM usando el systemContext y el mensaje real
    const systemContext = await llm.getSystemContext();
    const messages: OpenAI.ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: systemContext.trim(),
      },
      {
        role: "user",
        content: "[Ubicación compartida]" 
      }
    ];

    const _response = await llm.generateResponse(messages);

    response.contentType = "text";
    response.content = { body: _response.reply };
    return response;
  } catch (err) {
    console.error("Error guardando ubicación:", err);
  }
    }
   
  }catch(e: any){    
    throw await error.createError(e)
  }

}


export async function getResponse(data: string): Promise<string> {

  try{

    const systemContext = await llm.getSystemContext();

    const messages: OpenAI.ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: systemContext.trim(),
      },
      {
        role: "user",
        content: `El sistema de detección de video detectó los valores ${data}. Indicar qué detectó para que cualquier persona lo entienda. Sóolo responder con una oración concisa.`
      }
    ];
    
    const response = await llm.generateResponse(messages)

    if(!response){
      throw { code: 400, message: "LLM_NULL" }
    }

    return response
  }catch(e: any){
    throw await error.createError(e)
  }

}
