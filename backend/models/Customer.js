
import mongoose from 'mongoose';

const CustomerSchema = new mongoose.Schema(
  {
    customerId: {
      type: String,
      required: [true, 'Customer ID is required'],
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'], 
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
    },
    address: {
      type: String,
      trim: true,
    },
    totalOrders: {
      type: Number,
      required: [true, 'Total orders is required'], 
      default: 0,
      min: [0, 'Total orders cannot be negative'], 
    },
    totalReturns: {
      type: Number,
      required: [true, 'Total returns is required'], 
      default: 0,
      min: [0, 'Total returns cannot be negative'], 
    },
    returnRate: { // Calculated field, automatically updated via pre-save hook
      type: Number,
      default: 0.0,
      min: [0, 'Return rate cannot be negative'],
      max: [100, 'Return rate cannot exceed 100'], 
    },
    lastReturnDate: {
      type: Date,
      default: null, 
    },
    // Reference to the calculated risk score for this customer
    riskAnalysis: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ReturnRisk', // Refers to the ReturnRisk model
      default: null, 
    },
  },
  {
    timestamps: true, 
  }
);

CustomerSchema.pre('save', function (next) {
  if (this.totalReturns > this.totalOrders) {
    this.totalReturns = this.totalOrders; // Cap returns at total orders
  }
  // Calculate returnRate
  if (this.totalOrders > 0) {
    this.returnRate = (this.totalReturns / this.totalOrders) * 100;
  } else {
    this.returnRate = 0; // If no orders, return rate is 0
  }
  next();
});


// These lines create indexes on the customerId and email fields.
CustomerSchema.index({ customerId: 1 });
CustomerSchema.index({ email: 1 });


const Customer = mongoose.model('Customer', CustomerSchema);

export default Customer;
