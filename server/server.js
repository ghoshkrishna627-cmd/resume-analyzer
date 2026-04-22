// 🔥 FIX DNS ISSUE (IMPORTANT)
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
dns.setDefaultResultOrder("ipv4first");

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

// 📦 Load env variables
dotenv.config();

const app = express();


// ✅ CORS FIX (IMPORTANT FOR VERCEL)
app.use(cors({
  origin: "*",   // allow all (safe for your project demo)
}));


// 🔧 Middleware
app.use(express.json());


// 📡 MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));


// 📂 Routes
const resumeRoutes = require("./routes/resume");
app.use("/api/resume", resumeRoutes);


// 🧪 Test Route
app.get("/", (req, res) => {
  res.send("🚀 API Running Successfully");
});


// 🚀 Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});