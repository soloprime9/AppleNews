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



// We use a regular expression to capture the segments manually
router.get(/^\/([^\/]+)\/([^\/]+)\/?(.*)/, async (req, res) => {
  const source = req.params[0];
  const pid = req.params[1];
  const slug = req.params[2] || null;

  try {
    const pidNum = Number(pid);
    if (isNaN(pidNum)) return res.status(400).json({ error: "Invalid PID" });

    const post = await Post.findOne({ pid: pidNum }).populate("source");
    if (!post) return res.status(404).json({ error: "Post not found" });

    // Clean source name for URL
    const cleanSourceName = post.source.name
      .toLowerCase()
      .replace(/[^\w\s]/g, "") // remove special chars
      .replace(/\s+/g, "-");   // replace spaces with dash

    // 301 redirect if source mismatch
    if (source !== cleanSourceName) {
      const slugPart = post.slug ? post.slug.split("/").pop() : "";
      return res.redirect(301, `/${cleanSourceName}/${post.pid}/${slugPart}`);
    }

    // Return full post JSON
    return res.json({
      pid: post.pid,
      title: post.title,
      slug: post.slug,
      author: post.author,
      excerpt: post.excerpt,
      image: post.image,
      originalUrl: post.originalUrl,
      source: {
        name: post.source.name,
        website: post.source.website,
        logo: post.source.logo
      },
      publishedAt: post.publishedAt,
      fetchedAt: post.fetchedAt,
      views: post.views,
      clicks: post.clicks
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
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
