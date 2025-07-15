declare global {
	namespace Express {
		interface Request {
			user?: {
				userId: string
				clientId: string
			}
		}
	}
}

export {}