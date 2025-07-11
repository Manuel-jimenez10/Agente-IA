import { Request, Response, Router } from 'express';
import * as messageController from '@controllers/message.controller';
import * as messageSchema from '@schemas/message.schema';
import { validateParams } from '@middlewares/middlewares';

const router = Router();

router.get(
	'/getMessages',
	validateParams(messageSchema.getMessages), 
	async (req: Request, res: Response) => {
  
  try{
    const response = await messageController.getMessages()               
    res.send(response);
  }catch(e: any){
    res.status(e.code).send(e.message);
  }
});

// Envia mensajes al chat
router.get(
  '/chatMessageDispatcher',
  validateParams(messageSchema.chatMessageDispatcher), 
  async (req: Request, res: Response) => {
  
  try{
    const response = await messageController.chatMessageDispatcher()               
    res.send(response);
  }catch(e: any){
    res.status(e.code).send(e.message);
  }
});

export default router;
