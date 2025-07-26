const express = require("express");
const cors = require("cors"); // ✅ Only declared once
const mongoose = require("mongoose");
require("dotenv").config();
const bodyParser=require("bodyParser");
const app = express();
const PORT = process.env.PORT || 5000;

// ✅ CORS Middleware
app.use(
  cors({
    origin: "http://localhost:8080",
    methods:["GET","POST","PUT","DELETE"],// your frontend
    credentials: true,
  })
);

app.use(express.json());
const returnRoutes = require('./routes/returnRoutes');
app.use('/api/returns', returnRoutes);

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));
  app.use(cors());
  app.use(bodyParser.json());

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

