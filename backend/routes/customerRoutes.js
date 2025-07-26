// backend/routes/customer.routes.js
import express from 'express';
import { getCustomers, getCustomerById } from '../controllers/customerController.js';
import { protect, authorize } from '../middleware/authMiddleware.js'; // Assuming your auth middleware path

const router = express.Router();

// Get all customers with optional search and filter
router.get('/', protect, authorize(['admin', 'superadmin']), getCustomers);

// Get a single customer by ID
router.get('/:id', protect, authorize(['admin', 'superadmin']), getCustomerById);

export default router;
