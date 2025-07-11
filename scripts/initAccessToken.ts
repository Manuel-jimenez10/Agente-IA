import 'module-alias/register'
import dotenv from 'dotenv'
import * as config from '@config/config'
import { whatsappTokenModel } from '@models/whatsapp-token.model'
import axios from 'axios';
import * as crypto from '@utils/crypto'

dotenv.config({ path: `env/.env${process.env.NODE_ENV}` });

async function initLongAccessToken() {

  try {

    const appId = config.WHATSAPP_APP_ID
    const appSecret = config.WHATSAPP_APP_SECRET
    const accessToken = ""
       
    const response = await axios.get(`https://graph.facebook.com/oauth/access_token`, {
      params: {
        grant_type: 'fb_exchange_token',
        client_id: appId,
        client_secret: appSecret,
        fb_exchange_token: accessToken
      }
    });

    const text = response.data.access_token
    const secretKey = config.WHATSAPP_LONG_ACCESS_TOKEN_CRYPTO_SECRET_KEY
    const salt = config.WHATSAPP_LONG_ACCESS_TOKEN_CRYPTO_SALT

    const accessTokenEncrypted = await crypto.encrypt(text, secretKey, salt)

    await whatsappTokenModel.insertOne({
      "createdAt": new Date(),
      "token": accessTokenEncrypted
    })

  } catch (error) {}

  process.exit(0)

}

initLongAccessToken();