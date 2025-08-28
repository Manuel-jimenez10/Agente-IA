import express, { Request, Response } from 'express'
import { validateParams, verifyToken } from '@middlewares/middlewares'
import * as checkpointController from '@controllers/checkpoint.controller'
import * as checkpointSchema from '@schemas/checkpoint.schema'

const router = express.Router()

router.post(
  '/',
  validateParams(checkpointSchema.registerCheckpoint),
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const response = await checkpointController.registerCheckpoint(
        req.body.name as string,
        req.body.location as string,
        req.body.status as string,
        req.body.operators as string[],
        req.body.casesTotal as number,
        req.body.casesAttended as number
      );
      res.status(201).send(response);
    } catch(e: any){
		    res.status(e.code).send(e.message);
	  }
  }
);

router.get(
  '/find',
  validateParams(checkpointSchema.getCheckpoint),
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const response = await checkpointController.getCheckpoint(req.query.id as string);
      res.send(response);
    } catch(e: any){
		  res.status(e.code).send(e.message);
	  }
  }
);

router.get(
  '/',
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const fields = req.query.fields?.toString().split(',') || [];
      const response = await checkpointController.getAllCheckpoints(fields);
      res.send(response);
    } catch (e: any) {
      res.status(e.code).send(e.message)
    }
  }
);

router.put(
  '/find',
  validateParams(checkpointSchema.updateCheckpoint),
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const response = await checkpointController.updateCheckpoint(
        req.query.id as string,
        req.body
      );
      res.send(response);
    } catch (e: any) {
      res.status(e.code).send(e.message)
    }
  }
);

router.delete(
  '/find',
  validateParams(checkpointSchema.deleteCheckpoint),
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const response = await checkpointController.deleteCheckpoint(req.query.id as string);
      res.send(response);
    } catch (e: any) {
      res.status(e.code).send(e.message)
    }
  }
);

export default router