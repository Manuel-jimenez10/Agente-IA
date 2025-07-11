/**
 * Actualiza el access token de WhatsApp Business.
 * 
 * 1. Obtiene el access token actual almacenado en MongoDB y lo desencripta.
 * 2. Solicita un nuevo token de larga duración a la API de Facebook Graph usando el token desencriptado.
 * 3. Encripta el nuevo access token recibido.
 * 4. Actualiza el documento correspondiente en MongoDB con el nuevo token y la nueva fecha de creación.
 * 
 * La función finaliza cerrando el proceso de Node.js una vez completada la actualización.
*/

import 'module-alias/register'
import dotenv from 'dotenv'
import * as config from '@config/config'
import { whatsappTokenModel } from '@models/whatsapp-token.model'
import axios from 'axios';
import * as crypto from '@utils/crypto'

dotenv.config({ path: `env/.env${process.env.NODE_ENV}` });

async function updateLongAccessToken() {

  try {

    const secretKey = config.WHATSAPP_LONG_ACCESS_TOKEN_CRYPTO_SECRET_KEY
    const salt = config.WHATSAPP_LONG_ACCESS_TOKEN_CRYPTO_SALT

    const [whatsappToken] = await whatsappTokenModel.find({})

    const appId = config.WHATSAPP_APP_ID
    const appSecret = config.WHATSAPP_APP_SECRET
    const accessToken = whatsappToken.token
      
    const encryptedText = accessToken    
    const accessTokenDecrypted = await crypto.decrypt(encryptedText, secretKey, salt)

    const response = await axios.get(`https://graph.facebook.com/oauth/access_token`, {
      params: {
        grant_type: 'fb_exchange_token',
        client_id: appId,
        client_secret: appSecret,
        fb_exchange_token: accessTokenDecrypted
      }
    });

    const text = response.data.access_token
    const accessTokenEncrypted = await crypto.encrypt(text, secretKey, salt)

    await whatsappTokenModel.updateOne(
      { _id: whatsappToken._id }, 
      { createdAt: new Date(), token: accessTokenEncrypted } 
    )

  } catch (error) {}

  process.exit(0)

}

updateLongAccessToken();