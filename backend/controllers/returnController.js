// backend/controllers/return.controller.js
import Return from '../models/Return.js';
import Customer from '../models/Customer.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import ReturnRisk from '../models/ReturnRisk.js';

// Helper function to calculate risk score (reused from customer controller)
const calculateRiskScore = (totalOrders, totalReturns) => {
  if (totalOrders === 0) return 0;
  const returnRate = (totalReturns / totalOrders) * 100;
  return Math.min(Math.round(returnRate), 100);
};

const getReturnStats = asyncHandler(async (req, res) => {
  const totalReturnsCount = await Return.countDocuments();
  const pendingCount = await Return.countDocuments({ status: 'Pending' });
  const approvedCount = await Return.countDocuments({ status: 'Approved' });
  const rejectedCount = await Return.countDocuments({ status: 'Rejected' });
  
  const customers = await Customer.find({});
  let highRiskReturnCount = 0;
  customers.forEach(customer => {
    const riskScore = calculateRiskScore(customer.totalOrders, customer.totalReturns);
    if (riskScore >= 70) {
      highRiskReturnCount += customer.totalReturns;
    }
  });

  const stats = {
    total: totalReturnsCount,
    pending: pendingCount,
    approved: approvedCount,
    rejected: rejectedCount,
    highRisk: highRiskReturnCount,
  };

  res.status(200).json(new ApiResponse(200, stats, 'Return stats fetched successfully'));
});


/**
 * @function getReturns
 * @description Fetches a list of returns with optional search and filtering.
 * @route GET /api/returns
 * @access Private (Admin only)
 * @query search - Optional search term for customer, product, or reason
 * @query status - Optional filter by status ('Pending', 'Approved', 'Rejected')
 */
const getReturns = asyncHandler(async (req, res) => {
  const { search, status } = req.query;
  const query = {};
  
  if (search) {
    query.$or = [
      { customerName: { $regex: search, $options: 'i' } },
      { product: { $regex: search, $options: 'i' } },
      { reason: { $regex: search, $options: 'i' } },
    ];
  }

  if (status && status !== 'All') {
    query.status = status;
  }

  // Fetch returns from DB and populate customer details to get risk data
  const returns = await Return.find(query)
    .sort({ returnDate: -1 })
    .populate('customer', 'totalOrders totalReturns'); // Populate only needed fields

  const processedReturns = returns.map(returnItem => {
    // Get the populated customer object
    const customer = returnItem.customer;
    const riskScore = customer ? calculateRiskScore(customer.totalOrders, customer.totalReturns) : 0;
    
    return {
      id: returnItem._id,
      returnId: returnItem.returnId,
      orderId: returnItem.orderId,
      customerId: returnItem.customerId,
      customer: returnItem.customerName,
      product: returnItem.product,
      reason: returnItem.reason,
      status: returnItem.status,
      riskScore: riskScore,
      flags: returnItem.flags || [],
      productPrice: returnItem.productPrice,
    };
  });

  res.status(200).json(new ApiResponse(200, processedReturns, 'Returns fetched successfully'));
});


const getReturnById = asyncHandler(async (req, res) => {
  const returnId = req.params.id;

  const returnItem = await Return.findById(returnId).populate('customer', 'customerId email name');

  if (!returnItem) {
    throw new ApiError(404, 'Return not found');
  }

  const customer = returnItem.customer;
  const riskScore = customer ? calculateRiskScore(customer.totalOrders, customer.totalReturns) : 0;
  
  const returnDetails = {
    id: returnItem._id,
    returnId: returnItem.returnId,
    orderId: returnItem.orderId,
    product: {
      name: returnItem.product,
      sku: returnItem.productSku || 'N/A',
      category: returnItem.productCategory || 'N/A',
      price: returnItem.productPrice,
    },
    customer: {
      name: returnItem.customerName,
      email: customer?.email || 'N/A',
      id: customer?.customerId || 'N/A',
    },
    reason: returnItem.reason,
    status: returnItem.status,
    riskScore: riskScore,
    requestDate: returnItem.returnDate.toLocaleDateString('en-US'),
    responseTime: returnItem.responseTime || 'N/A',
    images: returnItem.images || [],
    adminNotes: returnItem.adminNotes || 'No notes available.',
    flags: returnItem.flags || [],
  };

  res.status(200).json(new ApiResponse(200, returnDetails, 'Return details fetched successfully'));
});


export { getReturnStats, getReturns, getReturnById };
