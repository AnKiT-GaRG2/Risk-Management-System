import mongoose from 'mongoose';
const CustomerSchema = new mongoose.Schema({
    customerId: {
        type: String,
        required: [true, 'Customer ID is required'],
        unique: true,
        trim: true
    },
    name: {
        type: String,
        required: [true, 'Customer name is required'],
        trim: true
    },
    email: {
        type: String,
        unique: true, 
        trim: true,
        lowercase: true,
        match: [/.+@.+\..+/, 'Please fill a valid email address']
    },
    address: {
        type: String,
        trim: true
    },
    // Example fields for return risk analysis (you'd expand this based on your needs)
    totalOrders: {
        type: Number,
        default: 0
    },
    totalReturns: {
        type: Number,
        default: 0
    },
    returnRate: { // Calculated field, might be updated by a controller
        type: Number,
        default: 0.0
    },
    lastReturnDate: {
        type: Date
    },
    // Reference to the calculated risk score for this customer
    riskAnalysis: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ReturnRisk' // Refers to the ReturnRisk model
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update `updatedAt` field on save
CustomerSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// --- Add Indexes Here ---
// These lines create indexes on the customerId and email fields.
// This significantly improves query performance for operations that search or filter by these fields.
// The '1' indicates an ascending index.
CustomerSchema.index({ customerId: 1 });
CustomerSchema.index({ email: 1 });
// --- End Indexes ---

const Customer = mongoose.model('Customer', CustomerSchema);

export default Customer;
