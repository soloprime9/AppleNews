require("dotenv").config();
const express = require("express");
const connection = require("./connection");
require("./cron/rssCron");
const Posts = require("./routers/posts");
const Source = require("./routers/source");
// require("./scripts/addSources")
const cors = require("cors");
const app = express();



app.use(express.json());

app.use(cors({
  origin: ['https://computer-xrfg.vercel.app']
}));

app.get("/",async(req,res)=> {
    res.json("Hello Deaedr");
});

app.use("/posts",Posts);
app.use("/source", Source);


app.listen(4000,console.log("Hello Dear"));
