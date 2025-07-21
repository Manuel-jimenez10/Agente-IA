import { Response, Request } from 'express';
import { v4 as uuidv4 } from 'uuid';
import * as error from '@utils/error'
import * as config from '@config/config'
import * as token from '@utils/token'
import * as hash from '@utils/hash'
import * as userService from '@services/user.service'
import * as emailService from '@services/email.service'
import * as settingService from '@services/setting.service'
import * as cookieService from '@services/cookie.service';
import * as profileService from '@services/profile.service'
import { authModel } from '@models/auth.model';

export async function registerAuth(userId: string | null, email: string, password: any): Promise<{id: string, now: Date}> {

  try{

    if(!userId){
      throw { code: 400, message: "USERID_NOT_FOUND" }
    }

    const now = new Date()    
    const sessionId = await hash.generateSessionId(userId)
    await authModel.insertOne({ createdAt: now, updatedAt: now, email: email, password: password, sessionId: sessionId, isLogged: false, userId: new ObjectId(userId) } )    

    return now

  }catch(e: any){
    throw await error.createError(e)
  }

}

export async function me(userId: string ): Promise<{ user: any }> {
	try {				

		const user = await userService.getUser({ _id: userId })

		return { user }
	} catch (error: any) {
		throw await error.createError(error)
	}
}

export async function encryptedPassword(password: string): Promise<any> {
	try {
		return await crypto.encryptedPassword()
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

    return await userModel.find({})
    
  }catch(e: any){
    throw await error.createError(e)
  }

}