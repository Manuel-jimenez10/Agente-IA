import express, { Request, Response } from 'express'
import { validateParams, verifyToken } from '@middlewares/middlewares'
import * as cameraSchema from '@schemas/camera.schema'
import * as cameraController from '@controllers/camera.controller'

const router = express.Router()

router.get(
	'/',
	validateParams(cameraSchema.getAllCameras),
	verifyToken,
	async (req: Request, res: Response) => {
		try {
			const response = await cameraController.getCameras()
			res.send(response)
		} catch (e: any) {
			res.status(e.code).send(e.message);
		}
	},
)

router.post(
	'/',
	validateParams(cameraSchema.registerCamera),
	verifyToken,
	async (req: Request, res: Response) => {
		try {
			const response = await cameraController.registerCamera(
				req.body.name as string,
				req.body.location as string,
				req.body.status as string,
			)
			res.status(201).send(response)
		} catch (e: any) {
			res.status(e.code).send(e.message);
		}
	},
)

router.get(
	'/find',
	validateParams(cameraSchema.getCamera),
	verifyToken,
	async (req: Request, res: Response) => {
		try {
			const response = await cameraController.getCamera(
				req.query.id as string,
			)
			res.send(response)
		} catch (e: any) {
			res.status(e.code).send(e.message);
		}
	},
)

router.put(
	'/find',
	validateParams(cameraSchema.updateCamera),
	verifyToken,
	async (req: Request, res: Response) => {
		try {
			const response = await cameraController.updateCamera(
				req.query.id as string,
				req.body,
			)
			res.send(response)
		} catch (e: any) {
			res.status(e.code).send(e.message);
		}
	},
)

router.delete(
	'/find',
	validateParams(cameraSchema.deleteCamera),
	verifyToken,
	async (req: Request, res: Response) => {
		try {
			const response = await cameraController.deleteCamera(
				req.query.id as string,
			)
			res.send(response)
		} catch (e: any) {
			res.status(e.code).send(e.message);
		}
	},
)

export default router