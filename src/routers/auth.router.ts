import { Request, Response, Router } from 'express';
import * as authController from '@controllers/auth.controller';
import * as authSchema from '@schemas/auth.schema';
import { validateParams, verifyToken } from '@middlewares/middlewares';
const router = Router();

router.post(
  '/register', 
  validateParams(authSchema.register), 
  async (req: Request, res: Response) => {
    
  try {
    
    const response = await authController.register(
		req.body.email as string,
		req.body.phone as string,
		req.body.name as string,
		req.body.lastname as string,
	)
    res.send(response);
   
  }catch(e: any){
    res.status(e.code).send(e.message);
  }

});

router.post(
  '/activateAccount', 
  validateParams(authSchema.activateAccount), 
  async (req: Request, res: Response) => {
    
  try {
    
    const response = await authController.activateAccount(
      req.body.token as string        
    );
    res.send(response);
   
  }catch(e: any){
    res.status(e.code).send(e.message);
  }

});

router.post(
	'/login',
	validateParams(authSchema.login),
	async (req: Request, res: Response) => {
		try {
			const response = await authController.login(
				req.body.id as string,
				req.body.clientId as string,
			)

			res.cookie('accessToken', response.token, {
				httpOnly: true,
				secure: false,
				maxAge: 2 * 60 * 60 * 1000,
			})

			const { token, ...payload } = response
			res.send(payload)
		} catch (e: any) {
			res.status(e.code || 500).send(e.message || 'Error en login')
		}
	},
)
  
  

router.post(
	'/logout', verifyToken,
	async (req: Request, res: Response) => {
		try {
			const response = await authController.logout(req, res)
			res.send(response)
		} catch (e: any) {
			res.status(e.code).send(e.message)
		}
	},
)

router.post(
  '/refreshToken',   
  validateParams(authSchema.refreshToken), 
  async (req: Request, res: Response) => {
    
  try {
    const response = await authController.refreshToken(
      req.body.sub as string,
      req.body.clientId as string      
    );
    res.send(response);     
  }catch(e: any){
    res.status(e.code).send(e.message);        
  }

});

router.get('/me', verifyToken, async (req: Request, res: Response) => {
	try {
		const response = await authController.getAuthenticatedUser(req)
		res.status(200).send(response)
	} catch (err: any) {
		res.status(err.code || 500).send({
			type: 'error',
			message: err.message || 'Error al obtener perfil',
		})
	}
})
  


export default router;