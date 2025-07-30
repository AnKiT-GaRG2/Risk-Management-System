import express from 'express';
import { getAnalyticsData } from '../controllers/analytics.js';
// import { protect, authorize } from '../middleware/authMiddleware.js'; // Comment out for testing

const router = express.Router();

// GET /api/analytics - Get analytics data (without auth for testing)
router.get('/', getAnalyticsData);

console.log("Analytics routes file loaded successfully");

export default router;