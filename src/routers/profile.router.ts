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

  router.post(
    '/create',
    validateParams(profileSchema.createProfileSchema),
    verifyToken,
    async (req: Request, res: Response) => {
      try {
        const response = await profileController.createProfile(
          req.body.userId,
        )
        res.status(201).send(response)
      } catch (e: any) {
        res.status(e.code || 500).send(e.message)
      }
    },
  )

  router.get(
		'/find',
		validateParams(profileSchema.profileSchema), verifyToken,
		async (req: Request, res: Response) => {
			try {
				const response = await profileController.getProfile(
					req.query.id as string
				)
				res.send(response)
			} catch (e: any) {
				res.status(e.code).send(e.message)
			}
		},
  )
  
  router.put(
    '/find',
    validateParams(profileSchema.updateProfileSchema), verifyToken,
    async (req: Request, res: Response) => {
      try {
        const response = await profileController.updateProfile(
          req.query.id as string,
          req.body
        )
        res.send(response)
      } catch (e: any) {
        res.status(e.code).send(e.message)
      }
    }
  )

  router.delete(
    '/find',
    validateParams(profileSchema.deleteProfileSchema), verifyToken,
    async (req: Request, res: Response) => {
      try {
        const response = await profileController.deleteProfile(
          req.query.id as string
        )
        res.send(response)
      } catch (e: any) {
        res.status(e.code).send(e.message)
      }
    }
  )  

export default router;