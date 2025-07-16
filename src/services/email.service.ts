import * as error from '@utils/error'
import * as email from '@utils/email'

export async function sendActivationEmail(emailToSend: { from: string; to: string; subject: string; html: string; }): Promise<void> {
	try {
		await email.send(emailToSend)
	} catch (e: any) {
		throw await error.createError(e)
	}
}
  
