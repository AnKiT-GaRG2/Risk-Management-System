// backend/models/Return.js
import mongoose from 'mongoose';

const ReturnSchema = new mongoose.Schema(
  {
    returnId: { // Unique ID for each return (e.g., RET001)
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    customer: { // Reference to the Customer who made the return
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
    },
    customerId: { // Store customerId for easier lookup/display without populate
      type: String,
      required: true,
      ref: 'Customer', // Can also be a ref, but storing string is fine for display
    },
    customerName: { // Store customer name for easier display
      type: String,
      required: true,
    },
    product: { // Name of the product returned
      type: String,
      required: true,
      trim: true,
    },
    reason: { // Reason for the return
      type: String,
      required: true,
      enum: ['Defective item', 'Wrong size/color', 'Not as described', 'Changed mind', 'Damaged in transit', 'Performance issues', 'Other'],
    },
    returnDate: { // Date of the return
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Index for efficient lookup by customer or return ID
ReturnSchema.index({ customer: 1 });
ReturnSchema.index({ returnId: 1 });

const Return = mongoose.model('Return', ReturnSchema);

export default Return;
