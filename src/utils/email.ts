import { MAIL_PASS, MAIL_USER } from '@config/config';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: MAIL_USER,
		pass: MAIL_PASS,
	},
})

export async function sendActivationEmail(
	email: string,
	token: string,
): Promise<void> {
	const activationUrl = `${process.env.FRONTEND_URL}/activate?token=${token}`

	await transporter.sendMail({
		from: `"TuApp" <${process.env.MAIL_USER}>`,
		to: email,
		subject: 'Activa tu cuenta',
		html: `
      <h2>Bienvenido</h2>
      <p>Haz clic para activar tu cuenta:</p>
      <a href="${activationUrl}">${activationUrl}</a>
    `,
	})
}
