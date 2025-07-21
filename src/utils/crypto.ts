import * as error from '@utils/error'
import * as crypto from 'crypto';
import * as config from '@config/config'
import bcrypt from 'bcrypt';

export async function encrypt(text: string, secretKey: string, salt: string): Promise<string> {

	try{	
		const algorithm = 'aes-256-cbc';		  	  			
		const key = crypto.scryptSync(secretKey, salt, 32);
		const iv = crypto.randomBytes(16);
		const cipher = crypto.createCipheriv(algorithm, key, iv);
		let encrypted = cipher.update(text, 'utf8', 'hex');
  		encrypted += cipher.final('hex');

  		return iv.toString('hex') + ':' + encrypted; 	    
	}catch(e: any){		
		throw await error.createError(e)
	}

}

export async function decrypt(encryptedText: string, secretKey: string, salt: string): Promise<string> {

	try{			  	
		const algorithm = 'aes-256-cbc';
	  	const key = crypto.scryptSync(secretKey, salt, 32);
	  	const textParts = encryptedText.split(':');
	  	const iv = Buffer.from(textParts[0], 'hex');
	  	const encrypted = textParts[1];

	  	const decipher = crypto.createDecipheriv(algorithm, key, iv);
	  
	  	let decrypted = decipher.update(encrypted, 'hex', 'utf8');
	  	decrypted += decipher.final('utf8');

	  return decrypted;

	}catch(e: any){
		throw await error.createError(e)
	}

}

export async function encryptPassword(password: string) {

  try{

    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);

    return encryptedPassword

  }catch(e: any){
    throw await error.createError(e)
  }

}

export async function verifyPassword(password: string, encryptedPassword: string) {

  try{       
    return await bcrypt.compare(password, encryptedPassword)    
  }catch(e: any){
    throw await error.createError(e)
  }

}