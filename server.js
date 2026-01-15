require("dotenv").config();
const express = require("express");
const connectDB = require("./connection");

const Posts = require("./routers/posts");
const Source = require("./routers/source");
const cors = require("cors");

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: [
      "https://computer-xrfg.vercel.app",
      "https://news.fondpeace.com",
      "http://localhost:3000"
    ],
  })
);

app.get("/", (req, res) => {
  res.json("Hello Dear");
});

app.use("/posts", Posts);
app.use("/source", Source);

// 🔥 MAIN FIX: START SERVER ONLY AFTER DB CONNECTS
async function startServer() {
  await connectDB();               // ✅ CONNECT DB FIRST
  require("./cron/rssCron");       // ✅ START CRON AFTER DB

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log("🚀 Server running on port", PORT);
  });
}

startServer();
