import express, { Request, Response } from 'express'
import { validateParams, verifyToken } from '@middlewares/middlewares'
import * as operatorSchema from '@schemas/operator.schema'
import * as operatorController from '@controllers/operator.controller'

const router = express.Router()

router.post(
  '/',
  validateParams(operatorSchema.registerOperator),
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const response = await operatorController.registerOperator(
        req.body.name as string,
        req.body.lastname as string,
        req.body.document as string,
        req.body.phone as string,
        req.body.status as string,
        req.body.role as string,
        req.body.assignedCheckpointId as string
      );
      res.status(201).send(response);
    } catch (e: any) {
      res.status(e.code).send(e.message);
    }
  }
);

router.get(
  '/find',
  validateParams(operatorSchema.getOperator),
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const response = await operatorController.getOperator(req.query.id as string);
      res.send(response);
    } catch (e: any) {
      res.status(e.code).send(e.message);
    }
  }
);

router.get(
  '/',
  validateParams(operatorSchema.getAllOperators),
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const fields = req.query.fields?.toString().split(',') || [];
      const response = await operatorController.getAllOperators(fields);
      res.send(response);
    } catch (e: any) {
      res.status(e.code).send(e.message);
    }
  }
);

router.put(
  '/find',
  validateParams(operatorSchema.updateOperator),
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const response = await operatorController.updateOperator(
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
  validateParams(operatorSchema.deleteOperator),
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const response = await operatorController.deleteOperator(req.query.id as string);
      res.send(response);
    } catch (e: any) {
      res.status(e.code).send(e.message);
    }
  }
);

export default router