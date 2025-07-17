import { Request, Response, Router } from 'express';
import { validateParams, verifyToken } from '@middlewares/middlewares';
import * as profileController from '@controllers/profile.controller';
import * as profileSchema from '@schemas/profile.schema';

const router = Router();

router.get(
    '/',
    validateParams(profileSchema.profilesSchema), verifyToken, 
    async (_req: Request, res: Response) => {
      try {
        const response = await profileController.getProfiles()
        res.send(response)
      } catch (e: any) {
        res.status(e.code).send(e.message)
      }
    }
  )
  
  router.get(
		'/:id',
		validateParams(profileSchema.profileSchema), verifyToken,
		async (req: Request, res: Response) => {
			try {
				const response = await profileController.getProfile(
					req.params.id,
				)
				res.send(response)
			} catch (e: any) {
				res.status(e.code).send(e.message)
			}
		},
  )
  
  router.put(
    '/:id',
    validateParams(profileSchema.updateProfileSchema), verifyToken,
    async (req: Request, res: Response) => {
      try {
        const response = await profileController.updateProfile(req.params.id, req.body)
        res.send(response)
      } catch (e: any) {
        res.status(e.code).send(e.message)
      }
    }
  )

  router.delete(
    '/:id',
    validateParams(profileSchema.deleteProfileSchema), verifyToken,
    async (req: Request, res: Response) => {
      try {
        const response = await profileController.deleteProfile(req.params.id)
        res.send(response)
      } catch (e: any) {
        res.status(e.code).send(e.message)
      }
    }
  )  

export default router;