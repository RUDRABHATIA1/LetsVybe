import express from 'express';
import { pingConsumption, takeLoan } from '../controllers/consumption.controller.js';
import protectRoute from '../middleware/protectRoute.js';

const router = express.Router();

router.post('/ping', protectRoute, pingConsumption);
router.post('/loan', protectRoute, takeLoan);

export default router;
