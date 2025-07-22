import express, { Request, Response } from 'express'
import { validateParams, verifyToken } from '@middlewares/middlewares'
import * as patrolcarSchema from '@schemas/patrolcar.schema'
import * as patrolcarController from '@controllers/patrolcar.controller'

const router = express.Router()

router.post(
  '/',
  validateParams(patrolcarSchema.registerPatrolcar),
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const response = await patrolcarController.registerPatrolcar(
        req.body.plateNumber as string,
        req.body.unit as string,
        req.body.type as string,
        req.body.status as string,
        req.body.assignedOfficerId as string
      );
      res.status(201).send(response);
    } catch (e: any) {
      res.status(e.code).send(e.message);
    }
  }
);

router.get(
  '/find',
  validateParams(patrolcarSchema.getPatrolcar),
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const response = await patrolcarController.getPatrolcar(req.query.id as string);
      res.send(response);
    } catch (e: any) {
      res.status(e.code).send(e.message);
    }
  }
);

router.get(
  '/',
  validateParams(patrolcarSchema.getAllPatrolcars),
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const fields = req.query.fields?.toString().split(',') || [];
      const response = await patrolcarController.getAllPatrolcars(fields);
      res.send(response);
    } catch (e: any) {
      res.status(e.code).send(e.message);
    }
  }
);

router.put(
  '/find',
  validateParams(patrolcarSchema.updatePatrolcar),
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const response = await patrolcarController.updatePatrolcar(
        req.query.id as string,
        req.body
      );
      res.send(response);
    } catch (e: any) {
      res.status(e.code).send(e.message);
    }
  }
);

router.delete(
  '/find',
  validateParams(patrolcarSchema.deletePatrolcar),
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const response = await patrolcarController.deletePatrolcar(req.query.id as string);
      res.send(response);
    } catch (e: any) {
      res.status(e.code).send(e.message);
    }
  }
);

export default router