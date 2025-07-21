import * as error from '@utils/error'
import * as email from '@utils/email'
import * as config from '@config/config'

export async function sendAccountActivationEmail(_email: string, activationHash: string): Promise<void>{

  try{
    const from = `Aigis ${config.NODEMAILER_FROM_NAME}`
    const to = _email
    const subject = "Activa tu cuenta"
    const data = _email    
    const activationLink = `${config.FRONTEND_URL}/activate-account/${activationHash}`
    const html = 
      `<html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif;">
          <div style="max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <div style="background-color: #4CAF50; color: white; text-align: center; padding: 20px;">
              <h1 style="margin: 0;">¡Activa tu cuenta!</h1>
            </div>
            <div style="padding: 20px; line-height: 1.6; color: #333;">
              <p style="margin: 0 0 10px;">Hola,</p>
              <p style="margin: 0 0 20px;">Gracias por registrarte. Por favor, haz clic en el botón de abajo para activar tu cuenta:</p>
              <p style="text-align: center; margin: 0 0 20px;">
                <a href="${activationLink}" style="display: inline-block; background-color: #4CAF50; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-weight: bold;">Activar Cuenta</a>
              </p>
              <p style="text-align: center; margin: 0 0 0px;">Si no puedes hacer click en el botón, haz click en el enlace de abajo</p>                              
              
              <p style="margin-top:2px; margin-bottom:16px"><a href="${activationLink}">${activationLink}</a></p>
              
              <p style="margin: 0 0 10px;">Si no creaste esta cuenta, puedes ignorar este correo electrónico.</p>
              <p style="margin: 0;">Saludos,<br>El equipo de Aigis</p>
            </div>           
          </div>
        </body>
      </html>`
    
    email.send(from, to, subject, html)
    
  }catch(e: any){               
    throw await error.createError(e)
  }

}