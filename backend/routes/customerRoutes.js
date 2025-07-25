import express from 'express';
import {
    createCustomer,
    getCustomers,
    getCustomerById,
    updateCustomer,
    deleteCustomer
} from '../controllers/customerController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import validate from '../middleware/validateMiddleware.js';
import { createCustomerSchema, updateCustomerSchema } from '../validators/customerValidator.js';

const router = express.Router();

// Routes for /api/customers
router.route('/')
    // POST /api/customers - Create a new customer (Admin/Superadmin only, with Joi validation)
    .post(protect, authorize(['admin', 'superadmin']), validate(createCustomerSchema, 'body'), createCustomer)
    // GET /api/customers - Get all customers (Admin/Superadmin only)
    .get(protect, authorize(['admin', 'superadmin']), getCustomers);

// Routes for /api/customers/:id
router.route('/:id')
    // GET /api/customers/:id - Get customer by ID (Admin/Superadmin only)
    .get(protect, authorize(['admin', 'superadmin']), getCustomerById)
    // PUT /api/customers/:id - Update customer by ID (Admin/Superadmin only, with Joi validation)
    .put(protect, authorize(['admin', 'superadmin']), validate(updateCustomerSchema, 'body'), updateCustomer)
    // DELETE /api/customers/:id - Delete customer by ID (Admin/Superadmin only)
    .delete(protect, authorize(['admin', 'superadmin']), deleteCustomer);

export default router;
