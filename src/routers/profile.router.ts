import { Request, Response, Router } from 'express';
import { uploadAvatar, validateParams, verifyToken } from '@middlewares/middlewares';
import * as profileController from '@controllers/profile.controller';
import * as profileSchema from '@schemas/profile.schema';
import * as avatarSchema from '@schemas/avatar.schema'

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
          req.body.userId as string,
          req.body.role ?? 'guest' as string
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
    validateParams(profileSchema.updateProfileSchema), 
    verifyToken,
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

router.post(
	'/avatar',
	uploadAvatar.single('avatar'),
	validateParams(avatarSchema.avatarSchema),
	verifyToken,
	async (req: Request, res: Response) => {
		try {
			const result = await profileController.uploadAvatar(
				req.query.id as string,
				req.file as Express.Multer.File,
			)
			res.status(201).send(result)
		} catch (e: any) {
			res.status(e.code).send(e.message)
		}
	},
)

router.put(
	'/avatar',
	uploadAvatar.single('avatar'),
	validateParams(avatarSchema.updateAvatarSchema),
	verifyToken,
	async (req: Request, res: Response) => {
		try {
			const result = await profileController.updateAvatar(
				req.query.id as string,
				req.file as Express.Multer.File,
			)
			res.send(result)
		} catch (e: any) {
			res.status(e.code).send(e.message)
		}
	},
)

router.delete(
	'/avatar',
	validateParams(avatarSchema.deleteAvatarSchema),
	verifyToken,
	async (req: Request, res: Response) => {
		try {
			const result = await profileController.deleteAvatar(
				req.query.id as string,
			)
			res.send(result)
		} catch (e: any) {
			res.status(e.code).send(e.message)
		}
	},
)

export default router;