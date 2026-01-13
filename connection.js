const mongoose = require("mongoose");

const MONGODB_URL = process.env.MONGO_URI;

console.log("Mongo URL:", MONGODB_URL);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;









// const mongoose = require("mongoose");

// const MONGODB_URL = process.env.MONGODB_URL;

// console.log("Mongo URL:", MONGODB_URL);

// if (!MONGODB_URL) {
//   console.error("❌ MONGO_URI not found in environment variables");
//   process.exit(1);
// }

// mongoose.connect(MONGODB_URL)
//   .then(() => {
//     console.log("✅ MongoDB Connected Successfully");
//   })
//   .catch((err) => {
//     console.error("❌ MongoDB Connection Failed:", err.message);
//   });









