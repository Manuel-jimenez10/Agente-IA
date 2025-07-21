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

export async function getUserDataByActivationHash(activationHash: string): Promise<{ userId: string | null, email: string | null, phone: string | null, name: string | null, lastname: string | null, password: string | null }> {

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

export async function saveResetToken(email: string): Promise<string> {
	try {
		const tokenData = email
		const recoveryHash = await hash.generateRandomHash(tokenData)
		const key = `recoveryHash:${recoveryHash}`
		const value = JSON.stringify({ email })
		const seconds = 600

		await cache.setWithExpiration(key, seconds, value)
		return recoveryHash
	} catch (e: any) {
		throw await error.createError(e)
	}
}

export async function getResetTokenData(recoveryHash: string, ): Promise<{ email: string | null }> {
	try {
		const key = `recoveryHash:${recoveryHash}`
		const data = await cache.get(key)
    
		if (!data) {
      throw { code: 400, message: 'ERROR_RECOVERY_HASH' }
    }

		const parsed: any = JSON.parse(data)
		return { email: parsed?.email }
	} catch (e: any) {
		throw await error.createError(e)
	}
}

export async function deleteResetToken(recoveryHash: string): Promise<void> {
	try {
		const key = `recoveryHash:${recoveryHash}`
		await cache.deleteKey(key)
	} catch (e: any) {
		throw await error.createError(e)
	}
}