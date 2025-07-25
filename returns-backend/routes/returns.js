const express = require("express");
const router = express.Router();

// Dummy data for now
const returns = [
  {
    id: "RET001",
    orderId: "ORD12845",
    customer: {
      name: "Sarah Johnson",
      email: "sarah.j@email.com",
      id: "CUST001"
    },
    product: {
      name: "iPhone 15 Pro Max",
      sku: "APL-IP15PM-256-TI",
      category: "Electronics",
      price: 1199
    },
    reason: "Screen flickering issue",
    status: "pending",
    riskScore: 92,
    requestDate: "2024-01-15",
    responseTime: "2 days",
    images: [],
    adminNotes: "Customer reported screen flickering.",
    flags: ["High risk customer"]
  },
];

router.get("/", (req, res) => {
  res.json(returns);
});

module.exports = router;

