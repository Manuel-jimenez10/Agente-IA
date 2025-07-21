import * as error from '@utils/error'
import * as token from '@utils/token'

export async function createToken(payload: Record<string, any>) {
	try {
		const expiresIn = '24h'
		return await token.create(payload, expiresIn)
	} catch (e: any) {
		throw await error.createError(e)
	}
}

export async function destroyToken() {

  try{       

    const expiresIn = '1s'
    await token.destroy(expiresIn)

  }catch(e: any){
    throw await error.createError(e)
  }

}
