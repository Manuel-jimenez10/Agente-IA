import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { ObjectSchema } from 'joi';
import { JWT_SECRET } from '@config/config';

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

export function verifyToken(
	req: Request,
	res: Response,
	next: NextFunction,
): void {
	const token = req.cookies.accessToken

	if (!token) {
		res.status(401).send('Token no proporcionado')
		return
	}

	try {
		const payload = jwt.verify(token, JWT_SECRET)
		next()
	} catch (err) {
		res.status(401).send('Token inválido o expirado')
	}
}
  