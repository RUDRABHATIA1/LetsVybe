import express from 'express';
import { pingConsumption, takeLoan } from '../controllers/consumption.controller.js';
import isAuth from '../middleware/isAuth.js';

const router = express.Router();

router.post('/ping', isAuth, pingConsumption);
router.post('/loan', isAuth, takeLoan);

export default router;
