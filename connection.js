const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URI;

console.log("Mongo URL:", MONGO_URI);

if (!MONGO_URI) {
  console.error("❌ MONGO_URI not found in environment variables");
  process.exit(1);
}

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Failed:", err.message);
  });
