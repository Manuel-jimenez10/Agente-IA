import * as error from '@utils/error'
import { getIO } from "@setup/initSocketServer";

export async function broadcastMessage(eventName: string, message: string): Promise<void>{

	try{
		const io = getIO()
		io.emit(eventName, message);
	}catch(e: any){
		throw await error.createError(e)
	}

}