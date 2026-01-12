function extractImage(item) {
  if (!item) return null;

  // 1️⃣ Priority: Standard Media Tags (MacRumors style)
  const mediaContent = item["media:content"];
  if (mediaContent) {
    const media = Array.isArray(mediaContent) ? mediaContent[0] : mediaContent;
    const url = media?.$?.url || media?.url;
    if (url) return normalize(url);
  }

  // 2️⃣ 9to5Mac FIX: Search in 'content' field first, then 'content:encoded', then 'description'
  // Your debug log shows the HTML is inside item.content
  const htmlSources = [
    item.content, 
    item["content:encoded"], 
    item.description
  ];

  for (const source of htmlSources) {
    const html = extractHtml(source);
    const imgFromHtml = findImg(html);
    if (imgFromHtml) return imgFromHtml;
  }

  return null;
}

/* ---------- helpers ---------- */

function extractHtml(field) {
  if (!field) return "";
  if (typeof field === "string") return field;
  // rss-parser sometimes wraps text in an object with a '_' property
  if (typeof field === "object" && field._) return field._;
  return "";
}

function findImg(html) {
  if (!html) return null;

  // Improved regex to catch images even with complex attributes
  const match = html.match(/<img[^>]+src=["']([^"'>]+)["']/i);
  if (!match || !match[1]) return null;

  let url = match[1];
  
  // Clean up the 9to5Mac URL (removes the ?quality=82... garbage)
  if (url.includes('?')) {
    url = url.split('?')[0];
  }

  const cleanUrl = normalize(url);
  return isBadImage(cleanUrl) ? null : cleanUrl;
}

function normalize(url) {
  if (!url) return "";
  return decodeURIComponent(
    url
      .replace(/&#038;/g, "&")
      .replace(/&amp;/g, "&")
      .trim()
  );
}

function isBadImage(url) {
  const lowercaseUrl = url.toLowerCase();
  return (
    !url ||
    lowercaseUrl.includes("pixel") ||
    lowercaseUrl.includes("tracking") ||
    lowercaseUrl.includes("gravatar") ||
    lowercaseUrl.includes("doubleclick") ||
    lowercaseUrl.includes("1x1") ||
    lowercaseUrl.endsWith(".gif") // Often tracking pixels are gifs
  );
}

module.exports = extractImage;