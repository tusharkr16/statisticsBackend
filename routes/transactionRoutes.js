import express from 'express';
import {  getBarChart, getStats, initializeDatabase, listTransactions } from '../controllers/transactionController.js';


const router = express.Router();

router.get('/initialize', initializeDatabase);
router.get('/transactions', listTransactions);
router.get('/stats', getStats);
router.get('/bar-chart', getBarChart);

export default router;
