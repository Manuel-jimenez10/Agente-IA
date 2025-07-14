import Redis from "ioredis";
import { v4 as uuidv4  } from 'uuid';

const redis = new Redis();

export async function saveUserData(
	email: string,
	phone: string,
): Promise<string> {
	const activationHash = uuidv4()
	const userId = uuidv4() // Generamos el ID único del usuario

	await redis.hmset(`user-activation:${activationHash}`, {
		userId,
		email,
		phone,
	})

	await redis.expire(`user-activation:${activationHash}`, 3600) // Expira en 1 hora

	return activationHash
}
  
export async function getUserDataByActivationHash(
	hash: string,
): Promise<{ userId: string; email: string; phone: string }> {
	const key = `user-activation:${hash}`
	const data = await redis.hgetall(key)

	if (!data || !data.email || !data.phone || !data.userId) {
		throw { code: 404, message: 'Hash de activación inválido o incompleto' }
	}

	return {
		userId: data.userId,
		email: data.email,
		phone: data.phone,
	}
}; 

export async function deleteUserData(hash: string): Promise<void> {
	const key = `user-activation:${hash}`
	await redis.del(key)
}  