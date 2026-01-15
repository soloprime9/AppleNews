const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

router.get("/", async (req, res) => {
  const posts = await Post.find()
    .populate("source", "name logo website")
    .sort({ publishedAt: -1 })
    .limit(50);

  res.json(posts);
  // console.log(posts);
});



router.get("/post-by-slug/:slug", async (req, res) => {
  const slug = req.params.slug;

  const post = await Posts.findOne({ slug });

  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }

  res.json(post);
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
