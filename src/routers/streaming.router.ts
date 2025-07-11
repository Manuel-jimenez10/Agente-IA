import { Request, Response, Router } from 'express';
import * as streamingController from '@controllers/streaming.controller';

const router = Router();

router.post(
	'/start',	
	async (req: Request, res: Response) => {
  
  try{
    const response = await streamingController.start()
    res.send(response);     
    
  }catch(e: any){
    res.status(e.code).send(e.message);
  }
});

router.post(
  '/stop', 
  async (req: Request, res: Response) => {
  
  try{
    const response = await streamingController.stop()
    res.send(response);     
    
  }catch(e: any){
    res.status(e.code).send(e.message);
  }
});


export default router;
