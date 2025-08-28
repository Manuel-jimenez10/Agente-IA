import { Request, Response, Router } from 'express'
import { validateParams, verifyToken } from '@middlewares/middlewares'
import * as menuSchema from '@schemas/menu.schema'
import * as menuController from '@controllers/menu.controller'

const router = Router()

router.get(
	'/rol',
	validateParams(menuSchema.getMenuByRole),
	verifyToken,
	async (req: Request, res: Response) => {
		try {
			const response = await menuController.getMenuByRole(
				req.query.rol as string,
			)
			res.send(response)
		} catch (e: any) {
			res.status(e.code).send(e.message)
		}
	},
)

router.get('/modules', 
	verifyToken, 
	async (req: Request, res: Response) => {
	try {
		const response = await menuController.getAllModules()
		res.send(response)
	} catch (e: any) {
		res.status(e.code).send(e.message)
	}
})

router.post(
	'/assign',
	validateParams(menuSchema.assignModule),
	verifyToken,
	async (req: Request, res: Response) => {
		try {
			const response = await menuController.assignModuleToRole(
				req.body.role as string,
				req.body.module as string,
			)
			res.send(response)
		} catch (e: any) {
			res.status(e.code).send(e.message)
		}
	},
)

router.delete(
	'/deallocate',
	validateParams(menuSchema.deallocateModule),
	verifyToken,
	async (req: Request, res: Response) => {
		try {
			const response = await menuController.deallocateModuleFromRole(
				req.body.role as string,
				req.body.module as string,
			)
			res.send(response)
		} catch (e: any) {
			res.status(e.code).send(e.message)
		}
	},
)

router.post(
	'/role/create',
	validateParams(menuSchema.createRole),
	verifyToken,
	async (req: Request, res: Response) => {
		try {
			const response = await menuController.createRole(
				req.body.name as string,
				req.body.description as string,
			)
			res.send(response)
		} catch (e: any) {
			res.status(e.code).send(e.message)
		}
	},
)

router.post(
	'/modules/create',
	validateParams(menuSchema.createModule),
	verifyToken,
	async (req: Request, res: Response) => {
		try {
			const response = await menuController.createModule(
				req.body.name as string,
				req.body.type as string,
			)
			res.send(response)
		} catch (e: any) {
			res.status(e.code).send(e.message)
		}
	},
)

export default router