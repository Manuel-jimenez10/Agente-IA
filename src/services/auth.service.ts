import * as error from '@utils/error'
import * as hash from '@utils/hash'
import * as userService from '@services/user.service'
import * as crypto from '@utils/crypto'
import { authModel } from '@models/auth.model';
import { userModel } from '@models/user.model';
import { ObjectId } from 'mongodb';

export async function registerAuth(userId: string | null, email: string | null, password: any): Promise<{id: string, now: Date}> {

  try{

    if(!userId){
      throw { code: 400, message: "USERID_NOT_FOUND" }
    }

    const now = new Date()    
    const sessionId = await hash.generateSessionId(userId)
    await authModel.insertOne({ createdAt: now, updatedAt: now, email: email, password: password, sessionId: sessionId, isLogged: false, userId: new ObjectId(userId) } )    

    return { id: sessionId, now }

  }catch(e: any){
    throw await error.createError(e)
  }

}

export async function me(userId: string ): Promise<{ user: any }> {
	try {				

		const user = await userService.getUser({ _id: new ObjectId(userId) })

		return { user }
	} catch (error: any) {
		throw await error.createError(error)
	}
}

export async function encryptedPassword(password: string): Promise<any> {
	try {
		return await crypto.encryptPassword(password)
	} catch (e: any) {
		throw await error.createError(e)
	}
}

export async function verifyCredentials(email: string, password: any) {

  try{
       
    const auth = await authModel.findOne({ email: email } )

    if(!auth){
      throw { code: 400, message: "AUTH_ERROR" }
    }

    const res = await crypto.verifyPassword(password, auth.password)
    if(!res){
      throw { code: 400, message: "PASSWORD_ERROR" }
    }

    return await userModel.findOne({ email: email})
    
  }catch(e: any){
    throw await error.createError(e)
  }

}