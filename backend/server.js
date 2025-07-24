// server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Connect to MongoDB using your connection string
mongoose.connect("mongodb+srv://shubhoffi1311:iB0TT7YdDl7Fwa0k@cluster0.oenlwb0.mongodb.net/CustomerReturnRiskAnalyser?retryWrites=true&w=majority&appName=Cluster0", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected successfully"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// 🧪 Simple test route
app.get('/', (req, res) => {
  res.send('API is running 🚀');
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server started at http://localhost:${PORT}`);
});
