import { Request, Response, Router } from 'express';
import * as videoController from '@controllers/video.controller';
import * as videoSchema from '@schemas/video.schema';
import { validateParams } from '@middlewares/middlewares';

const router = Router();

router.post(
	'/report',
	validateParams(videoSchema.report), 
	async (req: Request, res: Response) => {
  
  try{
    const response = await videoController.report()        
       
    res.send(response);     
    
  }catch(e: any){
    res.status(e.code).send(e.message);
  }
});


export default router;
