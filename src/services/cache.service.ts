import * as error from '@utils/error'
import * as cache from '@utils/cache';
import * as hash from '@utils/hash';
import { ObjectId } from 'mongodb';

export async function saveUserData(email: string, phone: string, name: string, lastname: string, encryptedPassword: any): Promise<string> {

  try{

    const data = email+phone+name+lastname
    const activationHash = await hash.generateRandomHash(data)
    const userId = new ObjectId()
    const seconds = 600
    const key = `activationHash: ${activationHash}`    
    const value = `{"userId":"${userId.toString()}", "email": "${email}", "phone": "${phone}", "name": "${name}", "lastname": "${lastname}", "password": "${encryptedPassword}"}`
    await cache.setWithExpiration(key, seconds, value)

    return activationHash

  }catch(e: any){
    throw await error.createError(e)
  }

}

export async function getUserDataByActivationHash(activationHash: string): Promise<{ userId: string | null, email: string | null, phone: string | null }> {

  try{

    const key = `activationHash: ${activationHash}` 
    let userData = await cache.get(key)

    if(!userData){
      throw { code: 400, message: "ERROR_ACTIVATION_HASH" }
    }
    
    const parsedUserData: any = JSON.parse(userData);

    return { userId: parsedUserData?.userId, email: parsedUserData?.email, phone: parsedUserData?.phone, name: parsedUserData?.name, lastname: parsedUserData?.lastname, password: parsedUserData?.password }

  }catch(e: any){    
    throw await error.createError(e)
  }

}

export async function deleteUserData(activationHash: string): Promise<void> {

  try{

    const key = `activationHash: ${activationHash}` 
    await cache.deleteKey(key)

  }catch(e: any){
    throw await error.createError(e)
  }

}