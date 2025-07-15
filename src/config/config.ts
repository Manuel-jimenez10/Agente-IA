import dotenv from 'dotenv'
dotenv.config({ path: `env/.env.${process.env.NODE_ENV}` });

export const SERVER_IP = process.env.SERVER_IP as string
export const SERVER_PORT = Number(process.env.SERVER_PORT)
export const MONGODB_URI = process.env.MONGODB_URI as string
export const DATABASE = process.env.DATABASE as string
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY as string
export const OPENAI_ORGANIZATION = process.env.OPENAI_ORGANIZATION as string
export const OPENAI_PROJECT = process.env.OPENAI_PROJECT as string
export const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN as string
export const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID as string
export const WHATSAPP_TO = process.env.WHATSAPP_TO as string
export const WHATSAPP_APP_ID = process.env.WHATSAPP_APP_ID as string
export const WHATSAPP_APP_SECRET = process.env.WHATSAPP_APP_SECRET as string
export const WHATSAPP_LONG_ACCESS_TOKEN_CRYPTO_SECRET_KEY = process.env.WHATSAPP_LONG_ACCESS_TOKEN_CRYPTO_SECRET_KEY as string
export const WHATSAPP_LONG_ACCESS_TOKEN_CRYPTO_SALT = process.env.WHATSAPP_LONG_ACCESS_TOKEN_CRYPTO_SALT as string
export const FACEBOOK_GRAPH_URL = process.env.FACEBOOK_GRAPH_URL as string
export const PROVIDER_URL = process.env.PROVIDER_URL as string
export const OWNER_PRIVATE_KEY = process.env.OWNER_PRIVATE_KEY as string
export const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS as string
export const CONTRACT_ABI = process.env.CONTRACT_ABI as string
export const WHATSAPP_WEBHOOK_VERIFY_TOKEN = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN as string
export const REDIS_HOST = process.env.REDIS_HOST as string
export const REDIS_PORT = Number(process.env.REDIS_PORT)
export const AGENT_TELEPHONE_NUMBER = process.env.AGENT_TELEPHONE_NUMBER as string
export const FLIGHT_BASE_API_URL = process.env.FLIGHT_BASE_API_URL as string
export const FLIGHT_USER_TOKEN = process.env.FLIGHT_USER_TOKEN as string
export const FLIGHT_PROJECT_UUID = process.env.FLIGHT_PROJECT_UUID as string
export const FLIGHT_REQUEST_ID = process.env.FLIGHT_REQUEST_ID as string
export const MAIL_USER = process.env.MAIL_USER as string 
export const MAIL_PASS = process.env.MAIL_PASS as string
export const FRONTEND_URL = process.env.FRONTEND_URL as string
export const JWT_SECRET = process.env.JWT_SECRET as string
