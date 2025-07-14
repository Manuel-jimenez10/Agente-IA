import { MAIL_PASS, MAIL_USER } from '@config/config'
import nodemailer from 'nodemailer'

export async function sendAccountActivationEmail(email: string, activationHash: string) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: MAIL_USER,
            pass: MAIL_PASS
        }
    });

    const activationLink = `${process.env.FRONTEND_URL}/activate?hash=${activationHash}`;

	await transporter.sendMail({
		from: '"TuApp" <noreply@tuapp.com>',
		to: email,
		subject: 'Activa tu cuenta',
		html: `<p>Haz clic en el siguiente enlace para activar tu cuenta:</p>
           <a href="${activationLink}">${activationLink}</a>`,
	});

}