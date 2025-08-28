import argon2 from 'argon2';
import * as error from '@utils/error'
import { keccak256 } from 'js-sha3';
import dayjs from 'dayjs';
import * as crypto from 'crypto';

export async function generateHash(data: string): Promise<string> {

	try{		
	   return keccak256(data);
	}catch(e: any){
		throw await error.createError(e)
	}

}

export async function generateRandomHash(data: string): Promise<string> {
  try{
    
    const r1 = Math.floor(10000000 + Math.random() * 90000000)
    const r2 = crypto.randomInt(10000000, 100000000)
    const hash = crypto.createHash('sha256').update(String(dayjs().valueOf())+String(r1)+String(r2)+data).digest('hex').substring(2,56)

    return hash

  }catch(e: any){
    throw await error.createError(e)
  }
}

export async function generateRandomName(data: string): Promise<string> {
  try{
    
    const name = (await generateRandomHash(data)).substring(16,30)
    return name

  }catch(e: any){
    throw await error.createError(e)
  }
}

export async function generateSecureHash(plainText: string): Promise<string> {
  try{
    
    const hashed = await argon2.hash(plainText, { type: argon2.argon2id });
    return hashed;

  }catch(e: any){
    throw await error.createError(e)
  }
}

export async function verifySecureHash(hashedValue: string, plainText: string): Promise<boolean> {
  try{
    
    const isMatch = await argon2.verify(hashedValue, plainText);
    return isMatch;

  }catch(e: any){
    throw await error.createError(e)
  }
}

export async function generateSessionId(data: string): Promise<string> {
  try{
    
    const sessionId = (await generateRandomHash(data)).substring(11,37)
    return sessionId

  }catch(e: any){
    throw await error.createError(e)
  }
}