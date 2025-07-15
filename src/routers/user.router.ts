import { Request, Response, Router } from 'express';
import * as userController from '@controllers/user.controller'
import * as userSchema from '@schemas/user.schema';
import { validateParams, verifyToken } from '@middlewares/middlewares';
const router = Router();

router.get('/', verifyToken, async (req: Request, res: Response) => {
	try {
		const response = await userController.getUsers()
		res.status(200).send(response)
	} catch (error: any) {
		res.status(error.code || 500).send({
			type: 'error',
			message: error.message || 'Error interno',
		})
	}
})  

router.get('/:id', verifyToken, async (req: Request, res: Response) => {
	try {
		const response = await userController.getUserById(req.params.id)
		res.status(200).send(response)
	} catch (error: any) {
		res.status(error.code || 500).send({
			type: 'error',
			message: error.message || 'Error interno',
		})
	}
})
  

router.put('/:id', validateParams(userSchema.updateUserSchema), verifyToken, async (req: Request, res: Response) => {
		try {
			const response = await userController.updateUser(
				req.params.id,
				req.body,
			)
			res.status(200).send(response)
		} catch (error: any) {
			res.status(error.code || 500).send({
				type: 'error',
				message: error.message || 'Error al actualizar el usuario',
			})
		}
	},
)
  
router.delete('/:id', verifyToken, async (req: Request, res: Response) => {
	try {
		const response = await userController.deleteUser(req.params.id)
		res.status(200).send(response)
	} catch (error: any) {
		res.status(error.code || 500).send({
			type: 'error',
			message: error.message || 'Error al borrar el usuario',
		})
	}
})
	 

export default router;