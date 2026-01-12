const Parser = require("rss-parser");
const parser = new Parser({
  customFields: {
    item: ["media:content", "media:thumbnail", "content:encoded"]
  }
});

const Post = require("../models/Post");
const extractImage = require("../utils/extractImage");

// 🔧 CONFIG
const MAX_ITEMS = 20;      // only latest 20 from feed
const HOURS_LIMIT = 48;    // only last 48 hours

async function fetchRSS(source) {
  console.log("🔍 Parsing:", source.name);

  const feed = await parser.parseURL(source.rssUrl);
  console.log("📰 Items:", feed.items.length);

  let savedCount = 0;
  let skippedCount = 0;

  const cutoffTime = Date.now() - HOURS_LIMIT * 60 * 60 * 1000;

  // 👉 ONLY LATEST ITEMS
  const latestItems = feed.items.slice(0, MAX_ITEMS);

  for (const item of latestItems) {

    // console.log(JSON.stringify(item, null, 2))
    if (!item.link || !item.title) continue;

    // ⏰ ONLY FRESH POSTS
    const publishedTime = new Date(item.pubDate).getTime();
    if (publishedTime < cutoffTime) {
      skippedCount++;
      console.log("⏭ Old post:", item.title);
      continue;
    }

    // 🔁 DUPLICATE CHECK
    const exists = await Post.findOne({ originalUrl: item.link });
    if (exists) {
      skippedCount++;
      console.log("⏭ Duplicate:", item.title);
      continue;
    }

    // 🖼 IMAGE (with fallback)
    const image = extractImage(item);
    if (!image) {
      skippedCount++;
      console.log("⏭ No image:", item.title);
      continue;
    }

    try {
      await Post.create({
        title: item.title,
        excerpt: item.contentSnippet?.slice(0, 250) || "",
        image,
        originalUrl: item.link,
        source: source._id,
        publishedAt: new Date(item.pubDate),
        fetchedAt: new Date()
      });

      savedCount++;
      console.log("💾 Saved:", item.title);

    } catch (err) {
      skippedCount++;
      console.error("❌ Save failed:", item.title);
      console.error(err.message);
    }
  }

  console.log(
    `✅ Done: ${source.name} | Saved: ${savedCount}, Skipped: ${skippedCount}`
  );
}

module.exports = fetchRSS;
