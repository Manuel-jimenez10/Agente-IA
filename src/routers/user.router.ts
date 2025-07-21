import { Request, Response, Router } from 'express';
import * as userController from '@controllers/user.controller'
import * as userSchema from '@schemas/user.schema';
import { validateParams, verifyToken } from '@middlewares/middlewares';
const router = Router();

router.get(
	'/', 
	validateParams(userSchema.getUsersSchema), verifyToken,
	async (req: Request, res: Response) => {
	try {
		const response = await userController.getUsers()
		res.send(response)
	}catch (e: any) {
		res.status(e.code).send(e.message)
	}
})  

router.get(
	'/find', 
	validateParams(userSchema.getUserSchema), verifyToken,
    async (req: Request, res: Response) => {
	try {
		const response = await userController.getUser(req.query.id as string);
		res.send(response)
	} catch (e: any) {
		res.status(e.code).send(e.message)
	}
})

router.put(
	'/find', 
	validateParams(userSchema.updateUserSchema), verifyToken,
	async (req: Request, res: Response) => {
	try {
		const response = await userController.updateUser(
			req.query.id as string,
			req.body			
		)
		res.send(response)
	} catch (e: any) {
		res.status(e.code).send(e.message)
	}
})
  
router.delete(
	'/find',
	validateParams(userSchema.deleteUserSchema),verifyToken, 
	async (req: Request, res: Response) => {
	try {
		const response = await userController.deleteUser(
			req.query.id as string
		)
		res.send(response)
	}catch (e: any) {
		res.status(e.code).send(e.message)
	}
})
	 

export default router;