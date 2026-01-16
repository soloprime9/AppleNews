const Parser = require("rss-parser");
const parser = new Parser({
  customFields: {
    item: ["media:content", "media:thumbnail", "content:encoded"]
  }
});

const Post = require("../models/Post");
const extractImage = require("../utils/extractImage");

// 🔧 CONFIG
const MAX_ITEMS = 20;
const HOURS_LIMIT = 48; // last 48 hours

// ----------------- HELPERS -----------------

// Generate 6-digit PID
function generatePid() {
  return Math.floor(100000 + Math.random() * 900000);
}

// Stop words and emotional words for SEO-friendly slug
const STOP_WORDS = [
  "the","a","an","of","to","in","on","for","and","with","your","how","via",
  "ultimate","best","amazing","guide","easy","simple","new"
];

// Clean source name (convert spaces to -, remove punctuation)
function cleanSourceName(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, "-");
}

// Generate slug from title: remove stop/emotional words, limit 10 words
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter(word => !STOP_WORDS.includes(word))
    .slice(0, 10)
    .join("-");
}

// Extract author safely from RSS item
function extractAuthor(item) {
  return item.creator || item.author || item["dc:creator"] || "";
}

// Build full Machash-style slug: source-lowercase/pid/seo-slug
function buildOwnSlug(sourceName, pid, title) {
  const sourcePart = cleanSourceName(sourceName);
  const titlePart = generateSlug(title);
  return `${sourcePart}/${pid}/${titlePart}`;
}

// ----------------- MAIN FUNCTION -----------------

async function fetchRSS(source) {
  console.log("🔍 Parsing:", source.name);

  const feed = await parser.parseURL(source.rssUrl);
  console.log("📰 Items found:", feed.items.length);

  let savedCount = 0;
  let skippedCount = 0;

  const cutoffTime = Date.now() - HOURS_LIMIT * 60 * 60 * 1000;
  const latestItems = feed.items.slice(0, MAX_ITEMS);

  for (const item of latestItems) {
    if (!item.link || !item.title) continue;

    const publishedTime = new Date(item.pubDate).getTime();
    if (publishedTime < cutoffTime) {
      skippedCount++;
      console.log("⏭ Old post:", item.title);
      continue;
    }

    const exists = await Post.findOne({ originalUrl: item.link });
    if (exists) {
      skippedCount++;
      console.log("⏭ Duplicate:", item.title);
      continue;
    }

    const image = extractImage(item);
    if (!image) {
      skippedCount++;
      console.log("⏭ No image:", item.title);
      continue;
    }

    try {
      // 🔹 Generate collision-safe PID
      let pid;
      let pidExists = true;
      while (pidExists) {
        pid = generatePid();
        pidExists = await Post.exists({ pid });
      }

      // 🔹 Generate slug and author
      const slug = buildOwnSlug(source.name, pid, item.title);
      const author = extractAuthor(item);

      // 🔹 Save to DB
      await Post.create({
        title: item.title,
        slug,        // full Machash-style
        pid,
        author,
        excerpt: item.contentSnippet?.slice(0, 250) || "",
        image,
        originalUrl: item.link,
        source: source._id,
        publishedAt: new Date(item.pubDate),
        fetchedAt: new Date()
      });

      savedCount++;
      console.log("💾 Saved:", slug);

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

