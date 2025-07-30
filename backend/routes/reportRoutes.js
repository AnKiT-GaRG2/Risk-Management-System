import express from 'express';
// import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/reports - Get reports data (placeholder)
router.get('/', (req, res) => {
  res.json({
    statusCode: 200,
    data: {
      message: "Reports endpoint coming soon"
    },
    message: "Reports data fetched successfully",
    success: true
  });
});

export default router;
