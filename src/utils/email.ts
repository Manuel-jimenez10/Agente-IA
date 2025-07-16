import nodemailer from 'nodemailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport'
import * as error from '@utils/error'
import * as config from '@config/config'

export async function send({ from, to, subject, html, }: { from: string; to: string; subject: string; html: string; }) {
	try {
		const transporter = nodemailer.createTransport({
			service: 'gmail',
			host: config.NODEMAILER_HOST,
			port: Number(config.NODEMAILER_PORT),
			secure: config.NODEMAILER_SECURE.toLowerCase() === 'true',
			auth: {
				user: config.NODEMAILER_AUTH_USER,
				pass: config.NODEMAILER_AUTH_PASS,
			},
			tls: {
				rejectUnauthorized:
					config.NODEMAILER_TLS_REJECT_UNAUTHOTIZED.toLowerCase() === 'true',
			},
		} as SMTPTransport.Options)

		return transporter.sendMail({
			from: from,
			to: to,
			subject: subject,
			html: html,
		})
	} catch (e: any) {
		throw await error.createError(e)
	}
}
