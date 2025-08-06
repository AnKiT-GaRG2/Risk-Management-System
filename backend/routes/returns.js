import express from "express";
const router = express.Router();

import { sendApprovalMail, sendRejectionMail } from "../utils/mailer.js";
import { getReturnStats, getReturns, getReturnById, approveReturn } from '../controllers/returnController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

// Get return statistics
router.get('/stats', protect, authorize(['admin', 'superadmin']), getReturnStats);

// Get all returns with optional filtering
router.get('/', protect, authorize(['admin', 'superadmin']), getReturns);

// Get single return by ID
router.get('/:id', protect, authorize(['admin', 'superadmin']), getReturnById);

// TEST ROUTE - Add this temporarily to test
router.get('/test-approve', (req, res) => {
  console.log('🔥 TEST ROUTE HIT');
  res.json({ success: true, message: 'Test route working' });
});

// Approve return and send email - WITH EXTENSIVE DEBUGGING
router.post('/:id/approve', protect, authorize(['admin', 'superadmin']), (req, res, next) => {
  console.log(`🔥 APPROVE ROUTE HIT - Return ID: ${req.params.id}`);
  console.log(`🔥 Request Method: ${req.method}`);
  console.log(`🔥 Request URL: ${req.originalUrl}`);
  console.log(`🔥 User ID: ${req.user?.id}`);
  console.log(`🔥 User Role: ${req.user?.role}`);
  console.log(`🔥 Request Headers:`, req.headers);
  console.log(`🔥 Request Body:`, req.body);
  next();
}, approveReturn);

// POST /api/returns/:id/reject
router.post("/:id/reject", async (req, res) => {
  console.log(`🔥 REJECT ROUTE HIT - Return ID: ${req.params.id}`);
  const returnId = req.params.id;
  const { email } = req.body;

  try {
    await sendRejectionMail(email, returnId);
    res.json({ success: true, message: "Return rejected and email sent." });
  } catch (error) {
    console.error("Error rejecting return:", error);
    res.status(500).json({ success: false, message: "Failed to reject return." });
  }
});

export default router;

