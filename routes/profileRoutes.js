import express from 'express'
import { getOrderController } from '../controllers/profileController.js';

const router = express();
// get orders
router.get('/getOrder',  getOrderController);

export default router