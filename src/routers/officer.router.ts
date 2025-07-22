import express, { Request, Response } from 'express'
import { validateParams, verifyToken } from '@middlewares/middlewares'
import * as officerSchema from '@schemas/officer.schema'
import * as officerController from '@controllers/officer.controller'

const router = express.Router()

router.post(
  '/',
  validateParams(officerSchema.registerOfficer),
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const response = await officerController.registerOfficer(
        req.body.name as string,
        req.body.lastname as string,
        req.body.badgeNumber as string,
        req.body.rank as string,
        req.body.phone as string,
        req.body.status as string
      );
      res.status(201).send(response);
    } catch (e: any) {
      res.status(e.code).send(e.message);
    }
  }
);

router.get(
  '/find',
  validateParams(officerSchema.getOfficer),
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const response = await officerController.getOfficer(req.query.id as string);
      res.send(response);
    } catch (e: any) {
      res.status(e.code).send(e.message);
    }
  }
);

router.get(
  '/',
  validateParams(officerSchema.getAllOfficers),
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const fields = req.query.fields?.toString().split(',') || [];
      const response = await officerController.getAllOfficers(fields);
      res.send(response);
    } catch (e: any) {
      res.status(e.code).send(e.message);
    }
  }
);

router.put(
  '/find',
  validateParams(officerSchema.updateOfficer),
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const response = await officerController.updateOfficer(
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
  validateParams(officerSchema.deleteOfficer),
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const response = await officerController.deleteOfficer(req.query.id as string);
      res.send(response);
    } catch (e: any) {
      res.status(e.code).send(e.message);
    }
  }
);


export default router