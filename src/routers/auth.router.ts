import { Request, Response, Router } from 'express';
import * as authController from '@controllers/auth.controller';
import * as authSchema from '@schemas/auth.schema';
import { validateParams, verifyToken, clearAccessTokenCookie } from '@middlewares/middlewares';
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
			res
		)

		res.send(response)
	} catch (e: any) {
		res.status(e.code).send(e.message)
	}
})   

router.post(
	'/logout', 
	verifyToken, clearAccessTokenCookie, validateParams(authSchema.logoutSchema),
	async (req: Request, res: Response) => {
	try {
		const response = await authController.logout()
		res.send(response)
	} catch (e: any) {
		res.status(e.code).send(e.message)
	}
})

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
 	} catch(e: any){
    	res.status(e.code).send(e.message);        
  	}

});

router.get(
	'/me',
	verifyToken, validateParams(authSchema.getMe),
	async (req: Request, res: Response) => {
	try {
		const response = await authController.getAuthenticatedUser(req)
		res.send(response)
	} catch (e: any) {
		res.status(e.code).send(e.message)
	}
})

export default router;