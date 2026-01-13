require("dotenv").config();
const express = require("express");
const connection = require("./connection");
require("./cron/rssCron");
const Posts = require("./routers/posts");
const Source = require("./routers/source");
const cors = require("cors");

const app = express();

app.use(express.json());

app.use(cors({
  origin: ['https://computer-xrfg.vercel.app','https://news.fondpeace.com']
}));

app.get("/", async (req, res) => {
  res.json("Hello Dear");
});

app.use("/posts", Posts);
app.use("/source", Source);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
