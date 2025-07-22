import jwt from 'jsonwebtoken';
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { Request, Response, NextFunction } from 'express';
import { ObjectSchema } from 'joi';
import { JWT_SECRET } from '@config/config';
import * as generator from '@utils/generator';

export function validateParams(schema: ObjectSchema) {
	return (req: Request, res: Response, next: NextFunction) => {
		const { error } = schema.validate({
			body: req.body,
			query: req.query,
			headers: req.headers,
		})

		if (error) {
			res.status(400).send('VALIDATE_PARAMS_ERROR')
			return
		}

		next()
	}
}

export function verifyToken(req: Request, res: Response, next: NextFunction, ): void {
	const authHeader = req.headers.authorization

	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		res.status(401).send('Token no proporcionado')
		return
	}

	const token = authHeader.split(' ')[1]

	try {
		jwt.verify(token, JWT_SECRET)
		next()
	} catch (err) {
		res.status(401).send('Token inválido o expirado')
	}
}

const avatarDir = path.join(process.cwd(), 'storage/avatars')
if (!fs.existsSync(avatarDir)) fs.mkdirSync(avatarDir, { recursive: true })

const storage = multer.diskStorage({
	destination: avatarDir,
	filename: async (_req, file, cb) => {
		try {
			const ext = path.extname(file.originalname).toLowerCase()
			cb(null, `${ await generator.generateFileId()}${ext}`)
		} catch {
			cb(new Error('ERROR_GENERANDO_NOMBRE_DE_ARCHIVO'), '')
		}
	},
})

export const uploadAvatar = multer({
	storage,
	limits: { fileSize: 2 * 1024 * 1024 },
})

  