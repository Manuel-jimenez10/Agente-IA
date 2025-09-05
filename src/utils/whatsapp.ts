import axios from 'axios';
import * as error from '@utils/error'
import * as config from '@config/config'
import mime from 'mime-types';
import FormData from "form-data";
import { Readable } from 'stream';
import fs from 'fs';
import path from 'path';

export async function send(accessToken: string, phoneNumberId: string, to: string, content: any): Promise<any> {
  try {
    const payload: any = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: to,
      type: content.type
    };

    if (content.type === "text") {
      payload.text = { body: content.body };
    } else if (content.type === "audio") {
      payload.audio = { id: content.audioId };
    } else if (content.type === "image") {
      payload.image = { id: content.mediaId, caption: content.caption }
    } else if (content.type === "interactive") {
      payload.interactive = { 
        type: "location_request_message",
        body: { text: content.body }, 
        action: { "name": "send_location" }
      }
    }

    await axios.post(
      `${config.FACEBOOK_GRAPH_URL}/${phoneNumberId}/messages`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

  } catch (e: any) {
    console.log(e.response?.data || e);
  }
}

export async function locationRequest(accessToken: string, phoneNumberId: string, to: string, content: any): Promise<any> {
  try {
    const payload: any = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: to,
      type: "interactive",
      interactive: { 
        type: "location_request_message", 
        body: { text: content }, 
        action: { "name": "send_location" }
      }
    };
   
    await axios.post(
      `${config.FACEBOOK_GRAPH_URL}/${phoneNumberId}/messages`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

  } catch (e: any) {
    console.log(e.response?.data || e);
  }
}

export async function getMediaUrl(mediaId: string) {
  const url = `${config.FACEBOOK_GRAPH_URL}/${mediaId}`;
  const response = await axios.get(url, {
    headers: {
      'Authorization': `Bearer ${config.WHATSAPP_ACCESS_TOKEN}`
    }
  });  
  return response.data.url;
}

export async function downloadAudio(mediaUrl: string) {
  try {
    const response = await axios.get(mediaUrl, {
      headers: { Authorization: `Bearer ${config.WHATSAPP_ACCESS_TOKEN}` },
      responseType: "arraybuffer",
    });
    
    return Buffer.from(response.data);
  } catch (e: any) {
    console.log(e.response?.data || e);
  }
}

export async function uploadAudio(accessToken: string, audioBuffer: any) {
  try {
    const formData = new FormData();
    
    const audioStream = new Readable();
    audioStream.push(audioBuffer);
    audioStream.push(null);
  
    formData.append("file", audioStream, {
      filename: "audio.ogg",
      contentType: "audio/ogg",
    });

    formData.append("messaging_product", "whatsapp");
    
    const configHeaders = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        ...formData.getHeaders(),
      },
    };
    const response = await axios.post(
      `${config.FACEBOOK_GRAPH_URL}/${config.WHATSAPP_PHONE_NUMBER_ID}/media`,
      formData,
      configHeaders
    );
    
    return response.data.id;
  } catch (e: any) {
    console.log(e.response?.data || e);
  }
}

export async function downloadImage(mediaId: string, mimeType: string) {
  try {
    const metadataResp = await axios.get(`${config.FACEBOOK_GRAPH_URL}/${mediaId}`, {
      headers: {
        Authorization: `Bearer ${config.WHATSAPP_ACCESS_TOKEN}`
      }
    });

    const downloadUrl = metadataResp.data.url;

    const imageResp = await axios.get(downloadUrl, {
      responseType: 'arraybuffer',
      headers: {
        Authorization: `Bearer ${config.WHATSAPP_ACCESS_TOKEN}`
      }
    });

    const imagePath = path.join(__dirname, '../../storage/whatsapp/', `${mediaId}.${mimeType.split("/")[1]}`);
    fs.writeFileSync(imagePath, imageResp.data);

    // NUEVO: devolvemos la ruta de la imagen por si hace falta usarla
    return imagePath;

  } catch (e: any) {
    console.log(e.response?.data || e);
  }
}

export async function uploadImage(imagePath: string): Promise<string> {   
  const url = `${config.FACEBOOK_GRAPH_URL}/${config.WHATSAPP_PHONE_NUMBER_ID}/media`;
  const image = fs.createReadStream(imagePath);

  const mimeType = `image/${path.extname(imagePath).replace('.', '')}`

  const formData = new FormData();
  formData.append("file", image);
  formData.append("type", mimeType);
  formData.append("messaging_product", "whatsapp");

  const response = await axios.post(url, formData, {
    headers: {
      Authorization: `Bearer ${config.WHATSAPP_ACCESS_TOKEN}`,
      ...formData.getHeaders()
    }
  });

  return response.data.id;
}

export async function sendTyping(to: string, messageId: string, type: string): Promise<void> {
  try {
    if (type === "text") {
      const url = `${config.FACEBOOK_GRAPH_URL}/${config.WHATSAPP_PHONE_NUMBER_ID}/messages`;
     
      const data = {
        "messaging_product": "whatsapp",
        "status": "read",
        "message_id": messageId,
        "typing_indicator": {
          "type": "text"        
        }
      }

      await axios.post(url, data, {
        headers: {
          'Authorization': `Bearer ${config.WHATSAPP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });
    }
  } catch (e: any) {
    console.log(e.response?.data || e);
  }
}

// NUEVO: enviar ubicación al usuario si hace falta
export async function sendLocation(accessToken: string, phoneNumberId: string, to: string, latitude: number, longitude: number, name?: string, address?: string) {
  try {
    const payload: any = {
      messaging_product: "whatsapp",
      to,
      type: "location",
      location: {
        latitude,
        longitude,
        name: name || "",
        address: address || ""
      }
    };

    await axios.post(
      `${config.FACEBOOK_GRAPH_URL}/${phoneNumberId}/messages`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (e: any) {
    console.log(e.response?.data || e);
  }
}
