import { Request, Response, Router } from 'express';
import * as droneController from '@controllers/drone.controller';
import * as droneSchema from '@schemas/drone.schema';
import { validateParams } from '@middlewares/middlewares';

const router = Router();

router.post(
	'/fly',	
	async (req: Request, res: Response) => {
  
  try{
    const response = await droneController.fly(
      req.body.longitude,
      req.body.latitude,
    )               
    res.send(response);         
  }catch(e: any){
    res.status(e.code).send(e.message);
  }
});


export default router;
