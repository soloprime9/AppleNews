const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const Source = require("../models/Source");

router.get("/", async (req, res) => {
  try{
    const posts = await Source.find();

  res.json(posts);
  // console.log(posts);

  }
  catch(error){
    console.log(error);
  }
});

router.delete("/delete",async (req, res) =>{
  
  try{
  const Deleted = await Post.deleteMany({image:null});
  res.json({
    message: "Deleted Successfully",
    Deleted
  })
}
  catch(error){
    res.status(500).json({
      success: True,
      message: "Not Deleted Successfully",
      error

    })
  }
})

// 🔥 DELETE ALL POSTS
router.delete("/delete-all", async (req, res) => {
  try {
    const result = await Post.deleteMany({});
    res.json({
      success: true,
      message: "All posts deleted successfully",
      deletedCount: result.deletedCount
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});



router.get("/hello", (req, res) =>{
  res.send("hello dear freinds");
})

router.post("/click/:id", async (req, res) => {
  await Post.findByIdAndUpdate(req.params.id, {
    $inc: { clicks: 1 }
  });
  res.sendStatus(200);
});

module.exports = router;
