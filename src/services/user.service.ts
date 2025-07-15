import jwt from 'jsonwebtoken'
import { userModel } from '@models/user.model'
import { JWT_SECRET } from '@config/config'

export async function registerUser(
	userId: string,
	now: Date,
	email: string,
	phone: string,
	name: string,
	lastname: string
) {
	await userModel.insertOne({
		_id: userId,
		email,
		phone,
		name,
		lastname,
		createdAt: now,
		isActive: true,
	})
}

export async function getUserById(userId: string): Promise<any | null> {
	return await userModel.findOne({ _id: userId })
}

export async function getUserByEmail(email: string): Promise<any | null> {
	return await userModel.findOne({ email })
}

export async function getAllUsers(fields: string[] = []): Promise<any[]> {
	return await userModel.find({}, fields)
}

export async function updateUserById(
	id: string,
	updateData: Record<string, any>,
): Promise<boolean> {
	const result = await userModel.updateOne(
		{ _id: id },
		updateData,
	)

	return result.matchedCount > 0
}
  

export async function getUserByIdParam(id: string): Promise<any | null> {
	return await userModel.findOne({ _id: id }, [
		'_id',
		'email',
		'phone',
		'name',
		'lastname'
	])
}
  

export async function decryptSub(sub: string): Promise<string> {
	const payload = jwt.verify(sub, JWT_SECRET) as {
		sub: string
	}
	return payload.sub
}

export async function deleteUserById(id: string): Promise<boolean> {
	const result = await userModel.deleteOne({ _id: id })
	return result.deletedCount > 0
}
  