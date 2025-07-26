
import mongoose from 'mongoose';

const ReturnSchema = new mongoose.Schema(
  {
    returnId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    customer: { 
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
    },
    customerId: {
      type: String,
      required: true,
      ref: 'Customer', 
    },
    customerName: { 
      type: String,
      required: true,
    },
    product: { 
      type: String,
      required: true,
      trim: true,
    },
    reason: { 
      type: String,
      required: true,
      enum: ['Defective item', 'Wrong size/color', 'Not as described', 'Changed mind', 'Damaged in transit', 'Performance issues', 'Other'],
    },
    returnDate: { 
      type: Date,
      default: Date.now,
    },
    // You might add more fields like:
    // quantity: { type: Number, default: 1 },
    // refundAmount: { type: Number },
    // status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' }
  },
  {
    timestamps: true, 
  }
);

// Index for efficient lookup by customer or return ID
ReturnSchema.index({ customer: 1 });
ReturnSchema.index({ returnId: 1 });

const Return = mongoose.model('Return', ReturnSchema);

export default Return;
