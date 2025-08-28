import * as error from './error';
import { randomInt, createHash } from 'crypto';
import dayjs from 'dayjs';

export async function generateRandomCode() {

	const r1 = Math.floor(10000000 + Math.random() * 90000000)
	const r2 = randomInt(10000000, 100000000)
	const hash = createHash('sha256').update(String(dayjs.valueOf())+String(r1)+String(r2)).digest('hex')
	const code = hash.substring(25, 45)

	return code

}

export async function generateAuthKey(id: string): Promise<string>{

	try{
		return id.substring(0,10) 
	}catch(e){
		throw await error.createError(e)
	}

}
