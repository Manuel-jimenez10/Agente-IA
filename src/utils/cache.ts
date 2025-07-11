import * as error from '@utils/error'
import Redis from 'ioredis';
import * as config from '@config/config'

const redis = new Redis({
    host: config.REDIS_HOST,
    port: config.REDIS_PORT,
});

export async function setWithExpiration(key: string, seconds: number, value: string) {
  try{
    await redis.setex(key, seconds, value);               
  }catch(e: any){
    throw await error.createError(e)
  }
}

export async function set(key: string, value: string) {
  try{
    await redis.set(key, value);               
  }catch(e: any){
    throw await error.createError(e)
  }
}

export async function get(key: string): Promise<string | null> {
  try{             
    return await redis.get(key);
  }catch(e: any){
    throw await error.createError(e)
  }
}

export async function deleteKey(key: string): Promise<void> {
  try{             
    await redis.del(key);
  }catch(e: any){
    throw await error.createError(e)
  }
}
