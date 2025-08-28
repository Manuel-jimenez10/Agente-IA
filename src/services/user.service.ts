import jwt from 'jsonwebtoken'
import * as error from '@utils/error'
import * as config from '@config/config'
import { userModel } from '@models/user.model'
import { ObjectId } from 'mongodb'

export async function registerUser(userId: string | null, now: Date, email: string | null, phone: string | null, name: string | null, lastname: string | null): Promise<void> {

  try{    

    if(!userId || !email || !phone || !name || !lastname){
      throw { code: 400, message: "DATA_NOT_FOUND" }
    }

    await userModel.insertOne({ _id: new ObjectId(userId), createdAt: now, updatedAt: now, email: email, phone: phone, name: name, lastname: lastname } )    
  }catch(e: any){
    throw await error.createError(e)
  }

}

export async function getUser(filter: Record<string, any>): Promise<any> {
	try {
		const user = await userModel.findOne(filter)
	
		return user || null
	} catch (e: any) {
		throw await error.createError(e)
	}
}

export async function getAllUsers(fields: string[] = []): Promise<any[]> {
	try {
		return await userModel.find({}, fields)
	} catch (e: any) {
		throw await error.createError(e)
	}
}
  
export async function decryptSub(sub: string): Promise<string> {
	try {
		const payload = jwt.verify(sub, config.JWT_SECRET) as { userId: string }
		return payload.userId
	} catch (e: any) {
		throw await error.createError(e)
	}
}  

export async function updateUser(id: string, updateData: Record<string, any>, ): Promise<{ message: string }> {
	try {
		const result = await userModel.updateOne({ _id: new ObjectId(id) }, updateData)
		if (!result) {
			throw {
				code: 404,
				message: 'Usuario no encontrado o sin campos válidos',
			}
		}
		return { message: 'Datos actualizados correctamente' }
	} catch (e: any) {
		throw await error.createError(e)
	}
}

export async function deleteUser(id: string): Promise<{ message: string }> {
	try {
		const result = await userModel.deleteOne({ _id: new ObjectId(id) })
		if (!result) {
			throw { code: 404, message: 'Usuario no encontrado' }
		}
		return { message: 'Usuario eliminado correctamente' }
	} catch (e: any) {
		throw await error.createError(e)
	}
}
  