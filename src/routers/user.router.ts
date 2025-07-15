import { Request, Response, Router } from 'express';
import * as userController from '@controllers/user.controller'
import * as userSchema from '@schemas/user.schema';
import { validateParams, verifyToken } from '@middlewares/middlewares';
const router = Router();

router.get('/', verifyToken, async (req: Request, res: Response) => {
	try {
		await userController.getUsers(req, res)
	} catch (error: any) {
		res.status(error.code || 500).send(error.message || 'Error interno')
	}
})

router.get('/:id', verifyToken, async (req: Request, res: Response) => {
	try {
		await userController.getUserById(req, res)
	} catch (error: any) {
		res.status(error.code || 500).send(error.message || 'Error interno')
	}
})

router.put('/:id', validateParams(userSchema.updateUserSchema), verifyToken, async (req: Request, res: Response) => {
	try {
		await userController.updateUser(req, res)
	} catch (error: any) {
		res.status(error.code || 500).send(
			error.message || 'Error al actualizar el usuario',
		)
	}
})

router.delete('/:id', verifyToken, async (req: Request, res: Response) => {
	try {
		await userController.deleteUser(req, res)
	} catch (error: any) {
		res.status(error.code || 500).send(
			error.message || 'Error al borrar el usuario',
		)
	}
})      

export default router;