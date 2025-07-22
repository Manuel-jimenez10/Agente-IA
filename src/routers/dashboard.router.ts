import { Router } from 'express';
import * as dashboardController from '@controllers/dashboard.controller';
import { validateParams, verifyToken } from '@middlewares/middlewares';

const router = Router();

router.get(
    '/', 
    verifyToken,
    async (req, res) => {
	try {
		const result = await dashboardController.getDashboardSummary()
		res.send(result)
	} catch (e: any) {
		res.status(e.code).send(e.message)
	}
})

export default router