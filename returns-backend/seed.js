require("dotenv").config();
const mongoose = require("mongoose");
const Return = require("./models/returns"); // assuming your model file is returns.js

const sampleReturns = [
  {
    customerId: "CUST001",
    product: "Wireless Headphones",
    reason: "Product not working",
    date: new Date("2025-07-15"),
    status: "pending",
    riskScore: 78,
    riskLevel: "High",
  },
  {
    customerId: "CUST002",
    product: "Running Shoes",
    reason: "Wrong size delivered",
    date: new Date("2025-07-20"),
    status: "approved",
    riskScore: 32,
    riskLevel: "Low",
  },
  {
    customerId: "CUST003",
    product: "Smartwatch",
    reason: "Changed mind",
    date: new Date("2025-07-10"),
    status: "rejected",
    riskScore: 55,
    riskLevel: "Medium",
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await Return.deleteMany({});
    await Return.insertMany(sampleReturns);

    console.log("✅ Seed data inserted successfully.");
    process.exit();
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seed();
