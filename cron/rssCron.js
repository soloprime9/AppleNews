const cron = require("node-cron");
const Source = require("../models/Source");
const fetchRSS = require("../services/rssFetcher");

cron.schedule("*/10 * * * *", async () => {
  console.log("⏰ Cron started");

  const sources = await Source.find({ active: true });
  console.log("📡 Sources found:", sources.length);

  for (const source of sources) {
    console.log("➡️ Fetching:", source.name);
    try {
      await fetchRSS(source);
      console.log("✅ Done:", source.name);
    } catch (err) {
      console.error("❌ RSS error:", source.name, err.message);
    }
  }
});
