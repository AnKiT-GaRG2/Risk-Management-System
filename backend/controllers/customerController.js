import Customer from '../models/Customer.js';
import ReturnRisk from '../models/ReturnRisk.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

/**
 * @function createCustomer
 * @description Creates a new customer record.
 * @route POST /api/customers
 * @access Private (Admin only)
 */
const createCustomer = asyncHandler(async (req, res) => {
    // Joi validation middleware ensures customerId and name are present and valid.
    const { customerId, name, email, address, totalOrders, totalReturns } = req.body;

    const customerExists = await Customer.findOne({ customerId });
    if (customerExists) {
        throw new ApiError(400, 'Customer with this ID already exists');
    }

    const customer = await Customer.create({
        customerId,
        name,
        email,
        address,
        totalOrders: totalOrders || 0,
        totalReturns: totalReturns || 0,
        returnRate: totalOrders > 0 ? (totalReturns / totalOrders) * 100 : 0
    });

    res.status(201).json(
        new ApiResponse(201, customer, 'Customer created successfully')
    );
});

/**
 * @function getCustomers
 * @description Retrieves a list of all customers, with optional pagination, search, and filtering.
 * @route GET /api/customers
 * @access Private (Admin only)
 * @queryParam {number} page - The page number for pagination (default: 1).
 * @queryParam {number} limit - The number of items per page (default: 10).
 * @queryParam {string} search - A search term to filter customers by name or email.
 * @queryParam {string} riskLevel - Filter customers by their calculated risk level (e.g., 'High', 'Medium').
 */
const getCustomers = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search;
    const riskLevel = req.query.riskLevel;

    let query = {};
    let populateOptions = {}; // Options for populating ReturnRisk

    // Optional: Add search/filter support (e.g., by name, email)
    if (search) {
        query.$or = [
            { name: { $regex: search, $options: 'i' } }, // Case-insensitive search
            { email: { $regex: search, $options: 'i' } },
            { customerId: { $regex: search, $options: 'i' } }
        ];
    }

    // Optional: Filter by riskLevel. This requires populating ReturnRisk and then filtering.
    // This approach fetches all customers, populates their risk, then filters in memory.
    // For very large datasets, a more advanced approach might involve a $lookup aggregation.
    if (riskLevel) {
        // We will populate riskAnalysis and then filter based on its riskLevel
        // The actual filtering will happen after fetching, or could be done with aggregation.
        // For simplicity here, we'll fetch and then filter in memory if riskLevel is provided.
        // A more efficient way for large datasets would be to use $lookup and $match in aggregation pipeline.
        populateOptions = { path: 'riskAnalysis', match: { riskLevel: riskLevel } };
    } else {
        // If no specific riskLevel filter, we might still want to populate riskAnalysis
        // to return comprehensive customer data, or keep it separate to avoid over-fetching.
        // For this general getCustomers, we'll populate if not specifically filtered by riskLevel,
        // or you can choose to only populate on a specific 'getCustomerWithRisk' endpoint.
        populateOptions = { path: 'riskAnalysis' };
    }


    // Fetch customers with pagination and search/filter
    // Consider indexing customerId, email for performance if reads are heavy.
    // Mongoose indexes are defined in the model schema itself, e.g., in Customer.js:
    // CustomerSchema.index({ customerId: 1 });
    // CustomerSchema.index({ email: 1 });
    const customersQuery = Customer.find(query)
        .skip(skip)
        .limit(limit)
        .populate(populateOptions); // Populate ReturnRisk reference

    const customers = await customersQuery;
    const totalCustomers = await Customer.countDocuments(query);

    // If riskLevel was provided, filter again after population if the match option wasn't enough
    // (e.g., if populate match just returns null for non-matching populated docs)
    let filteredCustomers = customers;
    if (riskLevel) {
        filteredCustomers = customers.filter(customer => customer.riskAnalysis && customer.riskAnalysis.riskLevel === riskLevel);
    }


    res.status(200).json(
        new ApiResponse(200, {
            customers: filteredCustomers,
            totalCustomers,
            page,
            totalPages: Math.ceil(totalCustomers / limit)
        }, 'Customers fetched successfully')
    );
});

/**
 * @function getCustomerById
 * @description Retrieves a single customer by ID.
 * @route GET /api/customers/:id
 * @access Private (Admin only)
 */
const getCustomerById = asyncHandler(async (req, res) => {
    // Optional: ReturnRisk reference isn’t populated — in getCustomerById, you might .populate("riskAnalysis")
    // to get the full risk details along with the customer.
    const customer = await Customer.findById(req.params.id).populate('riskAnalysis');
    if (!customer) {
        throw new ApiError(404, 'Customer not found');
    }
    res.status(200).json(
        new ApiResponse(200, customer, 'Customer fetched successfully')
    );
});

/**
 * @function updateCustomer
 * @description Updates an existing customer record.
 * @route PUT /api/customers/:id
 * @access Private (Admin only)
 */
const updateCustomer = asyncHandler(async (req, res) => {
    // Joi validation middleware ensures fields are valid and at least one is present.
    const { name, email, address, totalOrders, totalReturns, lastReturnDate } = req.body;

    const customer = await Customer.findById(req.params.id);

    if (!customer) {
        throw new ApiError(404, 'Customer not found');
    }

    // Update fields only if provided in the request body
    customer.name = name !== undefined ? name : customer.name;
    customer.email = email !== undefined ? email : customer.email;
    customer.address = address !== undefined ? address : customer.address;
    customer.totalOrders = totalOrders !== undefined ? totalOrders : customer.totalOrders;
    customer.totalReturns = totalReturns !== undefined ? totalReturns : customer.totalReturns;
    customer.lastReturnDate = lastReturnDate !== undefined ? lastReturnDate : customer.lastReturnDate;

    // Recalculate return rate if relevant fields changed
    if (customer.totalOrders > 0) {
        customer.returnRate = (customer.totalReturns / customer.totalOrders) * 100;
    } else {
        customer.returnRate = 0;
    }

    const updatedCustomer = await customer.save();
    res.status(200).json(
        new ApiResponse(200, updatedCustomer, 'Customer updated successfully')
    );
});

/**
 * @function deleteCustomer
 * @description Deletes a customer record.
 * @route DELETE /api/customers/:id
 * @access Private (Admin only)
 */
const deleteCustomer = asyncHandler(async (req, res) => {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
        throw new ApiError(404, 'Customer not found');
    }

    await customer.deleteOne(); // Use deleteOne() for Mongoose 6+
    // Also delete associated risk analysis if it exists
    await ReturnRisk.deleteOne({ customer: customer._id });

    res.status(200).json(
        new ApiResponse(200, null, 'Customer removed successfully')
    );
});

export {
    createCustomer,
    getCustomers,
    getCustomerById,
    updateCustomer,
    deleteCustomer
};
