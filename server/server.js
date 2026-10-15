
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const healthRoutes = require("./routes/healthRoutes");
const issueRoutes = require("./routes/issueRoutes");
const authRoutes = require("./routes/authRoutes");
const path = require("path");
const app = express();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  })
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/issues", issueRoutes);
app.use("/api/health", healthRoutes);


async function startServer() {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Fixora server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start Fixora:", error.message);
    process.exit(1);
  }
}

startServer();
