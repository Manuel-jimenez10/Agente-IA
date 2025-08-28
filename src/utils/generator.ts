import * as error from '@utils/error'

export async function generateFileId(length = 20): Promise<string> {
	try {
		const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
		return Array.from(
			{ length },
			() => chars[Math.floor(Math.random() * chars.length)],
		).join('')
	} catch (e: any) {
		throw await error.createError(e)
	}
}
