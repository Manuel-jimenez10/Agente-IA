import { Request, Response, Router } from 'express'
import { validateParams, verifyToken } from '@middlewares/middlewares'
import * as menuItemSchema from '@schemas/menu-item.schema'
import * as menuItemController from '@controllers/menu-item.controller'

const router = Router()

router.get(
	'/find',
	validateParams(menuItemSchema.getItemsByType),
	verifyToken,
	async (req: Request, res: Response) => {
		try {
			const items = await menuItemController.getByType(
				req.query.type as string,
			)
			res.send(items)
		} catch (e: any) {
			res.status(e.code).send(e.message)
		}
	},
)

router.post(
	'/create',
	validateParams(menuItemSchema.registerMenuItem),
	verifyToken,
	async (req: Request, res: Response) => {
		try {
			const response = await menuItemController.registerMenuItem(
				req.body.label as string,
				req.body.route as string,
				req.body.module as string,
				req.body.type as string,
				req.body.icon as string,
				req.body.visible as boolean,
				req.body.order as number,
			)
			res.status(201).send(response)
		} catch (e: any) {
			res.status(e.code).send(e.message)
		}
	},
)

router.get(
	'/query',
	validateParams(menuItemSchema.getItem),
	verifyToken,
	async (req: Request, res: Response) => {
		try {
			const item = await menuItemController.getById(
                req.query.id as string,
            )
			res.send(item)
		} catch (e: any) {
			res.status(e.code).send(e.message)
		}
	},
)

router.put(
	'/find',
	validateParams(menuItemSchema.updateItem),
	verifyToken,
	async (req: Request, res: Response) => {
		try {
			const updated = await menuItemController.updateById(
				req.query.id as string,
				req.body,
			)
			res.send(updated)
		} catch (e: any) {
			res.status(e.code).send(e.message)
		}
	},
)

router.delete(
	'/find',
	validateParams(menuItemSchema.deleteItem),
	verifyToken,
	async (req: Request, res: Response) => {
		try {
			const deleted = await menuItemController.deleteById(
                req.query.id as string,
            )
			res.send(deleted)
		} catch (e: any) {
			res.status(e.code).send(e.message)
		}
	},
)

export default router
