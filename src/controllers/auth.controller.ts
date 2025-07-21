import * as error from '@utils/error'
import * as authService from '@services/auth.service'
import * as userService from '@services/user.service'
import * as tokenService from '@services/token.service'
import * as cacheService from '@services/cache.service'
import * as emailService from '@services/email.service'

export async function register(email: string, phone: string, name: string, lastname: string, password: string ): Promise<{ type: string }> {
	try {

		const encryptedPassword = await authService.encryptedPassword(password)
		const activationHash = await cacheService.saveUserData(email, phone, name, lastname, encryptedPassword)
    	await emailService.sendAccountActivationEmail(email, activationHash)    

    	return { type: "success" }
	} catch (e: any) {
		throw await error.createError(e)
	}
}

export async function activateAccount(activationHash: string): Promise<{type: string}> {

  try{

    const { userId, email, phone, name, lastname, password } = await cacheService.getUserDataByActivationHash(activationHash)    
    await cacheService.deleteUserData(activationHash)    
    const { id, now } = await authService.registerAuth(userId, email, password)    
    await userService.registerUser(userId, now, email, phone, name, lastname)    
    
    return { type: "success" }

  }catch(e: any){
    throw await error.createError(e)
  }

}

export async function login(email: string, password: string): Promise<any> {

  try{
                  
    const user = await authService.verifyCredentials(email, password)
    const token = await tokenService.createToken({ userId: user._id.toString() })

    return { email, token }

  }catch(e: any){
    throw await error.createError(e)
  }

}

export async function logout() {

  try{            
    await tokenService.destroyToken();
    return { type: "success" }
  }catch(e: any){
    throw await error.createError(e)
  }

}

export async function refreshToken(sub: string): Promise<{token: string}> {
	try {
		const userId = await userService.decryptSub(sub)
		const token = await tokenService.createToken({ userId })
		
		return { token }
	} catch (e: any) {
		throw await error.createError(e)
	}
}

export async function me(userId: string): Promise<{ user: any }> {
	try {
		return await authService.me(userId)
	} catch (error: any) {
		throw await error.createError(error)
	}
}
  
  
  