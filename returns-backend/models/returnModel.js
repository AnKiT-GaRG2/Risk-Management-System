// File: returns.js
const mongoose = require("mongoose");

const returnSchema = new mongoose.Schema({
  customerId: String,
  product: String,
  reason: String,
  date: Date,
  status: String,
  riskScore: Number,
  riskLevel: String,
});

module.exports = mongoose.model("Return", returnSchema);
