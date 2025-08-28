import jwt from 'jsonwebtoken';
import * as error from '@utils/error'
import * as config from '@config/config'

export async function create(payload: Record<string, any> = {}, expiresIn: string) {
	try {
		const token = await jwt.sign(payload, config.JWT_SECRET, {
			expiresIn: expiresIn,
		})

		return token
	} catch (e: any) {
		throw await error.createError(e)
	}
}

export async function verify(token: string){

	try{
		jwt.verify(token, config.JWT_SECRET) as any
	}catch(e: any){
		throw await error.createError(e)
	}

}

export async function destroy(expiresIn: string){

	try{
		
		const token = await create({}, expiresIn)
		
	}catch(e: any){
		throw await error.createError(e)
	}

}